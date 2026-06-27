use axum::{
    routing::{get, post},
    Router,
    Json,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[derive(Serialize)]
struct VideoSummary {
    video_id: String,
    title: String,
    channel: String,
    duration: String,
    summary: String,
    key_points: Vec<String>,
    timestamps: Vec<Timestamp>,
    word_count: u32,
}

#[derive(Serialize)]
struct Timestamp {
    time: String,
    topic: String,
}

#[derive(Deserialize)]
struct SummarizeRequest {
    url: String,
    style: Option<String>,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Summarize any YouTube video".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(ApiResponse::<()> {
        success: true,
        data: None,
        error: None,
    })
}

async fn summarize_video(Json(req): Json<SummarizeRequest>) -> impl IntoResponse {
    let summary = VideoSummary {
        video_id: "dQw4w9WgXcQ".to_string(),
        title: "Video Title".to_string(),
        channel: "Channel Name".to_string(),
        duration: "15:30".to_string(),
        summary: "This video covers key concepts about the topic, providing detailed explanations and practical examples. The presenter walks through the main ideas step by step, making complex topics accessible to beginners.".to_string(),
        key_points: vec![
            "Main concept explained clearly".to_string(),
            "Practical examples demonstrated".to_string(),
            "Best practices discussed".to_string(),
            "Common mistakes to avoid".to_string(),
        ],
        timestamps: vec![
            Timestamp { time: "00:00".to_string(), topic: "Introduction".to_string() },
            Timestamp { time: "02:30".to_string(), topic: "Core Concepts".to_string() },
            Timestamp { time: "08:45".to_string(), topic: "Examples".to_string() },
            Timestamp { time: "12:00".to_string(), topic: "Conclusion".to_string() },
        ],
        word_count: 2500,
    };

    Json(ApiResponse {
        success: true,
        data: Some(summary),
        error: None,
    })
}

async fn get_transcript(Json req): Json<serde_json::Value> {
    let video_id = req.get("video_id").and_then(|v| v.as_str()).unwrap_or("");
    
    let transcript = serde_json::json!({
        "video_id": video_id,
        "segments": [
            { "start": 0.0, "text": "Welcome to this video" },
            { "start": 5.5, "text": "Today we'll discuss" },
            { "start": 12.0, "text": "Let's dive in" }
        ],
        "language": "en"
    });

    Json(ApiResponse {
        success: true,
        data: Some(transcript),
        error: None,
    })
}

async fn get_stats() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({
            "videos_summarized": 567890,
            "hours_saved": 23456,
            "avg_compression": "90%",
            "languages_supported": 50
        })),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/summarize", post(summarize_video))
        .route("/api/transcript", post(get_transcript))
        .route("/api/stats", get(get_stats))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Summarize any YouTube video backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
