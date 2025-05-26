package com.example.warehouseapp.ui.screens.warehouses

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.Screen
import com.example.warehouseapp.api.RetrofitClient
import com.example.warehouseapp.data.WarehouseResponseSchema

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WarehousesScreen(navController: NavController) {
    var warehouses by remember { mutableStateOf(listOf<Warehouse>()) }
    var isLoading by remember { mutableStateOf(true) }
    var responseMessage by remember { mutableStateOf("") }  // <- додали стан для повідомлень

    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.apiService.getAllWarehouses()
            if (response.isSuccessful) {
                val warehousesResponse = response.body()  // List<WarehouseResponseSchema>?
                responseMessage = "Success: Loaded ${warehousesResponse?.size ?: 0} warehouses"
                if (warehousesResponse != null) {
                    warehouses = warehousesResponse.map { it.toWarehouse() } // <-- оновлення списку складів
                }
            } else {
                responseMessage = "Error fetching warehouses: ${response.code()} ${response.message()}"
            }
        } catch (e: Exception) {
            responseMessage = "Exception: ${e.localizedMessage}"
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Warehouses") },
                actions = {
                    IconButton(onClick = { navController.navigate(Screen.MyWarehouses.route) }) {
                        Text("My Warehouses")
                    }
                }
            )
        },

    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            if (isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else {
                // Відобразити повідомлення з сервера / помилку
                if (responseMessage.isNotEmpty()) {
                    Text(
                        text = responseMessage,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(warehouses) { warehouse ->
                        WarehouseCard(
                            warehouse = warehouse,
                            onClick = { navController.navigate(Screen.WarehouseDetails.createRoute(warehouse.id.toString())) }

                        )
                    }
                }
            }
        }
    }
}


@OptIn(ExperimentalMaterial3Api::class)
@Composable

fun WarehouseCard(
    warehouse: Warehouse,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = warehouse.name,
                style = MaterialTheme.typography.titleLarge
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = warehouse.location ?: "No address",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Size: ${"%.2f".format(warehouse.size_sqm)} m²",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Price: $${"%.2f".format(warehouse.price_per_day)}/day",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = if (warehouse.is_blocked) "Blocked" else "Available",
                style = MaterialTheme.typography.bodyMedium,
                color = if (warehouse.is_blocked) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
            )
        }
    }
}

data class Warehouse(
    val id: Int,
    val name: String,
    val location: String? = null,
    val size_sqm: Double,
    val price_per_day: Double,
    val is_blocked: Boolean = false
)

