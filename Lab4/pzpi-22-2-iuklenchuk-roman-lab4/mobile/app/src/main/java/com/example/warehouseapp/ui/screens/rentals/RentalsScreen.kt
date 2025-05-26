// RentWarehouseScreen.kt
package com.example.warehouse.ui.screens

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
import java.time.LocalDate
import java.util.*
data class PremiumService(
    val id: Int,
    val name: String,
    val description: String,
    val price: Double
)
@Composable
fun RentalsScreen(
    warehouseId: String,
    services: List<PremiumService>,
    onSubmit: (warehouseId: String, start: LocalDate, end: LocalDate, selectedServices: List<Int>) -> Unit
) {
    var showDialog by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Button(
            onClick = { showDialog = true },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Rent This Warehouse")
        }

        if (showDialog) {
            RentDialog(
                services = services,
                onDismiss = { showDialog = false },
                onSubmit = { start, end, selectedServices ->
                    onSubmit(warehouseId, start, end, selectedServices)
                    showDialog = false
                }
            )
        }
    }
}

@Composable
fun RentDialog(
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
            TextButton(onClick = onDismiss) {
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

    val calendar = Calendar.getInstance().apply {
        time = Date()
        if (minDate != null) {
            set(minDate.year, minDate.monthValue - 1, minDate.dayOfMonth)
        }
    }

    val datePickerDialog = remember {
        DatePickerDialog(
            context,
            { _: DatePicker, year: Int, month: Int, dayOfMonth: Int ->
                onDateSelected(LocalDate.of(year, month + 1, dayOfMonth))
            },
            date.year,
            date.monthValue - 1,
            date.dayOfMonth
        ).apply {
            datePicker.minDate = minDate?.toEpochDay()?.times(24 * 60 * 60 * 1000)
                ?: today.toEpochDay() * 24 * 60 * 60 * 1000
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
