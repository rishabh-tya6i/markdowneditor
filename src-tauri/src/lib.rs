use tauri::Manager;
use tauri::menu::{Menu, MenuItem, Submenu, PredefinedMenuItem};
use tauri_plugin_dialog::{DialogExt, FilePath};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
async fn open_file(app: tauri::AppHandle) -> Result<(String, String), String> {
    let file = app.dialog().file().blocking_pick_file();
    
    match file {
        Some(file_path) => {
            let path_buf = match file_path {
                FilePath::Path(path) => path,
                FilePath::Url(url) => url.to_file_path().map_err(|_| "Invalid file URL".to_string())?,
            };
            let path_str = path_buf.to_string_lossy().to_string();
            let content = fs::read_to_string(&path_buf)
                .map_err(|e| format!("Failed to read file: {}", e))?;
            Ok((path_str, content))
        },
        None => Err("No file selected".to_string()),
    }
}

#[tauri::command]
async fn save_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to save file: {}", e))?;
    Ok(())
}

#[tauri::command]
async fn save_file_as(app: tauri::AppHandle, content: String) -> Result<String, String> {
    let file = app.dialog().file().blocking_save_file();
    
    match file {
        Some(file_path) => {
            let path_buf = match file_path {
                FilePath::Path(path) => path,
                FilePath::Url(url) => url.to_file_path().map_err(|_| "Invalid file URL".to_string())?,
            };
            let path_str = path_buf.to_string_lossy().to_string();
            fs::write(&path_buf, content)
                .map_err(|e| format!("Failed to save file: {}", e))?;
            Ok(path_str)
        },
        None => Err("No file selected".to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
        open_file,
        save_file,
        save_file_as
    ])
    .setup(|app| {
      // Setup menu
      let menu = Menu::default(app.handle())?;
      app.set_menu(menu)?;

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
