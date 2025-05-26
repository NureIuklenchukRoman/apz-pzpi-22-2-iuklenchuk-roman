package com.example.warehouseapp.ui.screens.placeholder

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun PlaceholderScreen(
    title: String,
    navController: NavController,   // add navController parameter
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        // Example usage of navController: a button that navigates somewhere
        Button(onClick = { navController.navigate("some_route") }) {
            Text("Go somewhere")
        }
    }
}
