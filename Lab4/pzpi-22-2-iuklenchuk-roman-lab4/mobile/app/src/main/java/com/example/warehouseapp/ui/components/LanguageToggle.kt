package com.example.warehouseapp.ui.components

import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Language

@Composable
fun LanguageToggle(
    currentLanguage: String,
    onLanguageChange: (String) -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }
    val languages = listOf("English", "Ukrainian")

    IconButton(onClick = { showMenu = true }) {
        Icon(Icons.Default.Language, contentDescription = "Change Language")
    }

    DropdownMenu(
        expanded = showMenu,
        onDismissRequest = { showMenu = false }
    ) {
        languages.forEach { language ->
            DropdownMenuItem(
                text = { Text(language) },
                onClick = {
                    onLanguageChange(language)
                    showMenu = false
                }
            )
        }
    }
} 