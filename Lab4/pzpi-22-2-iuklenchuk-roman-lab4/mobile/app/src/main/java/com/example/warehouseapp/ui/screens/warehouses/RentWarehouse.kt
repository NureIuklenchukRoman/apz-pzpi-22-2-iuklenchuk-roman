package com.example.warehouseapp.ui.screens.warehouses

// RentWarehouseScreen.kt

import android.app.DatePickerDialog
import android.widget.DatePicker
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.selection.DisableSelection
import androidx.compose.material3.*
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import java.time.LocalDate
import java.util.*
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.launch
import retrofit2.HttpException
import java.io.IOException
import com.example.warehouseapp.api.RetrofitClient

import com.example.warehouseapp.data.PremiumService
import com.example.warehouseapp.data.RentWarehouseRequest


fun List<com.example.warehouseapp.data.PremiumService>.toUiModel(): List<PremiumService> =
    this.map { dataService ->
        PremiumService(
            id = dataService.id,
            name = dataService.name,
            description = dataService.description,
            price = dataService.price,
            warehouse_id = dataService.warehouse_id
        )
    }

@Composable
fun RentalsScreen(
    navController: NavController,
    warehouseId: String,
) {
    val coroutineScope = rememberCoroutineScope()
    var showDialog by remember { mutableStateOf(false) }
    var services by remember { mutableStateOf<List<PremiumService>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var rentError by remember { mutableStateOf<String?>(null) }

    fun onSubmit(
        start: LocalDate,
        end: LocalDate,
        selectedServices: List<Int>
    ) {
        coroutineScope.launch {
            try {
                val api = RetrofitClient.apiService
                val request = RentWarehouseRequest(
                    start_date = start.toString(),
                    end_date = end.toString(),
                    selected_services = if (selectedServices.isEmpty()) null else selectedServices
                )
                val response = api.rentWarehouse(warehouseId.toInt(), request)
                if (response.isSuccessful) {
                    rentError = null
                    showDialog = false
                    navController.navigate("home")
                    // maybe navigate back or show success message
                } else {
                    rentError = "Rent failed: ${response.code()}"
                }
            } catch (e: Exception) {
                rentError = "Network or server error: ${e.localizedMessage}"
            }
        }
    }
    LaunchedEffect(warehouseId) {
        coroutineScope.launch {
            try {
                val api = RetrofitClient.apiService
                val response = api.getWarehouseServices(warehouseId.toInt())
                if (response.isSuccessful) {
                    services = response.body() ?: emptyList()
                    isLoading = false
                } else {
                    errorMessage = "Error: ${response.code()}"
                    isLoading = false
                }
            } catch (e: IOException) {
                errorMessage = "Network Error"
                isLoading = false
            } catch (e: HttpException) {
                errorMessage = "Server Error: ${e.code()}"
                isLoading = false
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {


                RentDialog(
                    navController = navController,
                    services = services,
                    onDismiss = { showDialog = false },
                    onSubmit = { start, end, selectedServices ->
                        onSubmit(start, end, selectedServices)
                        showDialog = false
                    }
                )


    }
}

@Composable
fun RentDialog(
    navController: NavController,
    services: List<PremiumService>,
    onDismiss: () -> Unit,
    onSubmit: (start: LocalDate, end: LocalDate, selectedServices: List<Int>) -> Unit
) {
    val context = LocalContext.current

    var startDate by remember { mutableStateOf<LocalDate?>(null) }
    var endDate by remember { mutableStateOf<LocalDate?>(null) }
    val selectedServices = remember { mutableStateListOf<Int>() }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(
                onClick = {
                    if (startDate != null && endDate != null) {
                        onSubmit(startDate!!, endDate!!, selectedServices.toList())
                    }
                }
            ) {
                Text("Confirm Rent")
            }
        },
        dismissButton = {
            TextButton(onClick = { navController.navigate("warehouses") }) {
                Text("Cancel")
            }
        },
        title = { Text("Select Dates and Services") },
        text = {
            Column {
                DatePickerField("Start Date", startDate) {
                    startDate = it
                    if (endDate != null && it > endDate) {
                        endDate = null
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                DatePickerField("End Date", endDate, minDate = startDate) {
                    endDate = it
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text("Premium Services:", style = MaterialTheme.typography.titleMedium)

                Spacer(modifier = Modifier.height(8.dp))

                services.forEach { service ->
                    Row(
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                        modifier = Modifier.padding(vertical = 4.dp)
                    ) {
                        Checkbox(
                            checked = selectedServices.contains(service.id),
                            onCheckedChange = { checked ->
                                if (checked) {
                                    selectedServices.add(service.id)
                                } else {
                                    selectedServices.remove(service.id)
                                }
                            }
                        )
                        Column {
                            Text("${service.name} - $${service.price}")
                            Text(
                                service.description,
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }
        }
    )
}

@Composable
fun DatePickerField(
    label: String,
    selectedDate: LocalDate?,
    minDate: LocalDate? = null,
    onDateSelected: (LocalDate) -> Unit
) {
    val context = LocalContext.current
    val today = LocalDate.now()
    val date = selectedDate ?: today

    // Convert LocalDate to epoch millis (start of day UTC)
    fun localDateToMillis(date: LocalDate): Long {
        // Use atStartOfDay in system default zone, then get epoch millis
        return date.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli()
    }

    // Create DatePickerDialog each recomposition because minDate might change
    val datePickerDialog = remember(minDate, date) {
        DatePickerDialog(
            context,
            { _, year, month, dayOfMonth ->
                onDateSelected(LocalDate.of(year, month + 1, dayOfMonth))
            },
            date.year,
            date.monthValue - 1,
            date.dayOfMonth
        ).apply {
            datePicker.minDate = localDateToMillis(minDate ?: today)
        }
    }

    OutlinedTextField(
        value = selectedDate?.toString() ?: "",
        onValueChange = {},
        readOnly = true,
        label = { Text(label) },
        modifier = Modifier
            .fillMaxWidth()
            .clickable { datePickerDialog.show() }
    )
}
