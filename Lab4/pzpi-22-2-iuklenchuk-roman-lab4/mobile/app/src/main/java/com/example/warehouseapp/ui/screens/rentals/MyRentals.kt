package com.example.warehouseapp.ui.screens.rentals


import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.data.Rental
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import com.example.warehouseapp.api.RetrofitClient
import com.example.warehouseapp.Screen

@Composable
fun MyRentalsScreen(navController: NavController) {
    val rentals = remember { mutableStateListOf<Rental>() }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val response = RetrofitClient.apiService.getMyRentals()
                if (response.isSuccessful) {
                    val rentalList = response.body()
                    if (rentalList != null) {
                        rentals.clear()
                        rentals.addAll(rentalList)
                    } else {
                        error = "Empty response from server"
                    }
                } else {
                    error = "Failed to load rentals: ${response.code()} ${response.message()}"
                }
            } catch (e: Exception) {
                error = e.message ?: "Failed to load rentals"
            } finally {
                loading = false
            }
        }
    }

    if (loading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
    } else if (error != null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(text = error ?: "", color = MaterialTheme.colorScheme.error)
        }
    } else {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("My Rentals", style = MaterialTheme.typography.headlineMedium)

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items(rentals) { rental ->
                    RentalCard(rental = rental, onClick = {
                        navController.navigate(Screen.DetailedRent.createRoute(rental.id))
                    })
                }
            }
        }
    }
}

@Composable
fun RentalCard(rental: Rental, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = rental.warehouse_name, style = MaterialTheme.typography.titleLarge)

            Spacer(modifier = Modifier.height(4.dp))
            StatusChip(status = rental.status)

            Spacer(modifier = Modifier.height(4.dp))
            Text("Location: ${rental.warehouse_location}", style = MaterialTheme.typography.bodyMedium)
            Text("Start: ${formatDate(rental.start_date)}", style = MaterialTheme.typography.bodyMedium)
            Text("End: ${formatDate(rental.end_date)}", style = MaterialTheme.typography.bodyMedium)

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "Total: $${"%.2f".format(rental.total_price)}",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun StatusChip(status: String) {
    val color = when (status.lowercase()) {
        "reserved" -> MaterialTheme.colorScheme.primary
        "pending" -> MaterialTheme.colorScheme.secondary
        "completed" -> MaterialTheme.colorScheme.tertiary
        "cancelled" -> MaterialTheme.colorScheme.error
        else -> MaterialTheme.colorScheme.outline
    }

    AssistChip(
        onClick = {},
        label = { Text(status.uppercase()) },
        colors = AssistChipDefaults.assistChipColors(containerColor = color)
    )
}

fun formatDate(dateString: String): String {
    return try {
        val localDate = LocalDate.parse(dateString)
        localDate.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
    } catch (e: Exception) {
        "Invalid Date"
    }
}
