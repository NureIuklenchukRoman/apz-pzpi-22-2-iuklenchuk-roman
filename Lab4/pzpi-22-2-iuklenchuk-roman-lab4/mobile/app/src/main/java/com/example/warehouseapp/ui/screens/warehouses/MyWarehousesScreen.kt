package com.example.warehouseapp.ui.screens.warehouses

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.Screen
import com.example.warehouseapp.api.RetrofitClient
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyWarehousesScreen(
    navController: NavController,
) {
    var warehouses by remember { mutableStateOf(listOf<Warehouse>()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    // Виконуємо завантаження при старті екрану
    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getMyWarehouses()
            if (response.isSuccessful) {
                warehouses = response.body()?.map { dto ->
                    Warehouse(
                        id = dto.id,
                        name = dto.name,
                        location = dto.location,
                        size_sqm = dto.size_sqm,
                        price_per_day = dto.price_per_day,
                        is_blocked = dto.is_blocked
                    )
                } ?: emptyList()
            } else {
                errorMessage = "Failed to load warehouses: ${response.code()}"
            }
        } catch (e: Exception) {
            errorMessage = "Error: ${e.localizedMessage}"
        }
        isLoading = false
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Warehouses") },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* TODO: Navigate to create warehouse */ }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Warehouse")
            }
        }
    ) { padding ->
        when {
            isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            errorMessage != null -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(errorMessage ?: "Unknown error")
                }
            }
            warehouses.isEmpty() -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("You don't have any warehouses yet")
                }
            }
            else -> {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(warehouses) { warehouse ->
                        MyWarehouseCard(
                            warehouse = warehouse,
                            onEdit = { navController.navigate(Screen.EditWarehouse.createRoute(warehouse.id.toString())) },
                            onDetails = { navController.navigate(Screen.WarehouseDetails.createRoute(warehouse.id.toString())) }
                        )
                    }
                }
            }
        }
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyWarehouseCard(
    warehouse: Warehouse,
    onEdit: () -> Unit,
    onDetails: () -> Unit
) {
    Card(
        onClick = onDetails,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = warehouse.name,
                    style = MaterialTheme.typography.titleLarge
                )
                Text(
                    text = if (!warehouse.is_blocked) "Available" else "Rented",
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (!warehouse.is_blocked)
                        MaterialTheme.colorScheme.primary 
                    else 
                        MaterialTheme.colorScheme.error
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = warehouse.location ?: "No address",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Size: ${warehouse.size_sqm} m²",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Price: $${warehouse.price_per_day}/month",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = onEdit,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Edit Warehouse")
            }
        }
    }
} 