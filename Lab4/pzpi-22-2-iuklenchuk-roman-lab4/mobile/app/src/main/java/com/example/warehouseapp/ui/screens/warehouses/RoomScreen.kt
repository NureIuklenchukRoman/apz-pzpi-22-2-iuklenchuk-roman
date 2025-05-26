package com.example.warehouseapp.ui.screens.warehouses

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.ui.components.MainLayout
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.clickable

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoomScreen(navController: NavController) {
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var selectedRoom by remember { mutableStateOf<Room?>(null) }

    MainLayout(
        navController = navController,
        title = "Warehouse Rooms",
        showBackButton = true
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
            }

            errorMessage?.let { error ->
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium
                )
            }

            // Room List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(sampleRooms) { room ->
                    RoomCard(
                        room = room,
                        onClick = { selectedRoom = room }
                    )
                }
            }
        }
    }

    // Room Details Dialog
    selectedRoom?.let { room ->
        RoomDetailsDialog(
            room = room,
            onDismiss = { selectedRoom = null },
            onEdit = {
                selectedRoom = null
                navController.navigate("edit_room/${room.id}")
            }
        )
    }
}

@Composable
private fun RoomCard(
    room: Room,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = room.name,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Size: ${room.size} m²",
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "Price: $${room.price}/month",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}

@Composable
private fun RoomDetailsDialog(
    room: Room,
    onDismiss: () -> Unit,
    onEdit: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(room.name) },
        text = {
            Column {
                Text("Size: ${room.size} m²")
                Text("Price: $${room.price}/month")
                Text("Description: ${room.description}")
                Text("Status: ${if (room.isAvailable) "Available" else "Occupied"}")
            }
        },
        confirmButton = {
            TextButton(onClick = onEdit) {
                Text("Edit")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Close")
            }
        }
    )
}

data class Room(
    val id: String,
    val name: String,
    val size: Int,
    val price: Double,
    val description: String,
    val isAvailable: Boolean
)

// Sample data
private val sampleRooms = listOf(
    Room(
        id = "1",
        name = "Storage Room A",
        size = 100,
        price = 500.0,
        description = "Large storage room with high ceilings",
        isAvailable = true
    ),
    Room(
        id = "2",
        name = "Storage Room B",
        size = 75,
        price = 375.0,
        description = "Medium-sized storage room",
        isAvailable = false
    ),
    Room(
        id = "3",
        name = "Storage Room C",
        size = 50,
        price = 250.0,
        description = "Small storage room",
        isAvailable = true
    )
) 