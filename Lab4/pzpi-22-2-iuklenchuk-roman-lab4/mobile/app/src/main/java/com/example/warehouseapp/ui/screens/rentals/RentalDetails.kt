package com.example.warehouseapp.ui.screens.rentals
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import kotlinx.coroutines.launch
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import com.example.warehouseapp.api.RetrofitClient
import com.example.warehouseapp.data.RentalDetailResponse
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RentDetailScreen(
    navController: NavController,
    rentId: String
) {
    var rental by remember { mutableStateOf<RentalDetailResponse?>(null) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(rentId) {
        try {
            val response = RetrofitClient.apiService.getMyRentDetail(rentId.toInt())
            if (response.isSuccessful) {
                rental = response.body()
            } else {
                error = response.errorBody()?.string() ?: "Failed to load rental"
            }
        } catch (e: Exception) {
            error = e.message ?: "An error occurred"
        } finally {
            loading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Rental Details") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            when {
                loading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                error != null -> {
                    Text(
                        text = error ?: "Unknown error",
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                rental != null -> {
                    RentalDetailContent(rental!!)
                }
            }
        }
    }
}

@Composable
fun RentalDetailContent(rental: RentalDetailResponse) {
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Warehouse: ${rental.warehouse_name}", style = MaterialTheme.typography.titleMedium)
        Text("Location: ${rental.warehouse_location}")
        Text("Start Date: ${rental.start_date}")
        Text("End Date: ${rental.end_date}")
        Text("Status: ${rental.status}")
        Text("Total Price: $${rental.total_price}")
        rental.code?.let {
            Text("Access Code: $it", color = MaterialTheme.colorScheme.primary)
        } ?: Text("No Access Code", color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}