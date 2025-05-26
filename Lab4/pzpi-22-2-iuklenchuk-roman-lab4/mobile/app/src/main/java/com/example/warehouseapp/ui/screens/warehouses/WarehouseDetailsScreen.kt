package com.example.warehouseapp.ui.screens.warehouses

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.Screen
import com.example.warehouseapp.api.RetrofitClient
import com.example.warehouseapp.data.WarehouseResponseSchema
import com.example.warehouseapp.ui.screens.warehouses.toWarehouse
import com.example.warehouseapp.TokenManager
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WarehouseDetailsScreen(
    navController: NavController,
    warehouseId: String
) {
    var warehouse by remember { mutableStateOf<Warehouse?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val userRole = remember {
        mutableStateOf<String?>(null)
    }
    LaunchedEffect(Unit) {
        userRole.value = TokenManager.getUserRole()
    }
    LaunchedEffect(warehouseId) {
        isLoading = true
        errorMessage = null
        try {
            // Конвертуємо warehouseId з String в Int
            val idInt = warehouseId.toIntOrNull()
            if (idInt == null) {
                errorMessage = "Invalid warehouse ID"
                isLoading = false
                return@LaunchedEffect
            }

            val response = RetrofitClient.apiService.getWarehouseDetails(idInt)
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    // Конвертуємо до типу Warehouse (якщо потрібно)
                    warehouse = body.toWarehouse()
                } else {
                    errorMessage = "No details found for this warehouse."
                }
            } else {
                errorMessage = "Error fetching details: ${response.code()} ${response.message()}"
            }
        } catch (e: Exception) {
            errorMessage = "Exception: ${e.localizedMessage}"
        } finally {
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Warehouse Details") },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(
                        onClick = {
                            warehouse?.let {
                                navController.navigate(Screen.EditWarehouse.createRoute(it.id.toString()))
                            }
                        }
                    ) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit")
                    }
                }
            )
        }
    ) { padding ->
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = androidx.compose.ui.Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (errorMessage != null) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = androidx.compose.ui.Alignment.Center
            ) {
                Text(text = errorMessage ?: "Unknown error")
            }
        } else {
            warehouse?.let { warehouse ->
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(padding)
                        .padding(16.dp)
                ) {
                    Text(
                        text = warehouse.name,
                        style = MaterialTheme.typography.headlineMedium
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = warehouse.location ?: "No address",
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Size: ${"%.2f".format(warehouse.size_sqm)} m²",
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Price: $${"%.2f".format(warehouse.price_per_day)}/day",
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Spacer(modifier = Modifier.height(16.dp))

                    Spacer(modifier = Modifier.height(24.dp))
                    userRole.value?.let { role ->
                        if (role.lowercase() != "admin") {
                            Button(
                                onClick = { navController.navigate("create-rent/$warehouseId") },
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Rent This Warehouse")
                            }
                        }
                    }
                }
            }
        }
    }
}

