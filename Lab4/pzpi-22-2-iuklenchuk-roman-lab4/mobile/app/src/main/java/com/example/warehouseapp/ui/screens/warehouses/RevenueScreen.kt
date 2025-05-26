package com.example.warehouseapp.ui.screens.warehouses
import androidx.compose.ui.graphics.vector.ImageVector

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Money
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.warehouseapp.R
import com.example.warehouseapp.data.RevenueData
import com.example.warehouseapp.api.RetrofitClient
import androidx.navigation.NavController

import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import android.util.Log

import kotlinx.coroutines.launch
import com.example.warehouseapp.TokenManager

@Composable
fun RevenueScreen(navController: NavController) {

    val userRole = remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        userRole.value = TokenManager.getUserRole()
    }

    if (userRole.value != "seller") {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(
                text = "Denied",
                color = MaterialTheme.colorScheme.error
            )
        }
        return
    }


    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current
    var revenueData by remember { mutableStateOf<RevenueData?>(null) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var selectedRange by remember { mutableStateOf("month") }
    val ApiService = RetrofitClient.apiService
    LaunchedEffect(selectedRange) {
        loading = true
        error = null
        try {
            val response = ApiService.getRevenue()
            if (response.isSuccessful) {
                revenueData = response.body()
                Log.d("Login", "Received data from backend: ${revenueData}")

            } else {
                error = response.errorBody()?.string() ?: "Error"
            }
        } catch (e: Exception) {
            error = e.message ?: "Fetching error"
        } finally {
            loading = false
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
        revenueData?.let { data ->
            LazyColumn(modifier = Modifier.padding(16.dp)) {
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Revenue analytics",
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        TimeRangeDropdown(selectedRange) { selectedRange = it }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    StatCard(
                        icon = Icons.Default.Money,
                        title = "total revenue",
                        value = "$%.2f".format(data.total_revenue)
                    )
                    StatCard(
                        icon = Icons.Default.TrendingUp,
                        title = "Monthlky revenue",
                        value = "$%.2f".format(data.monthly_revenue)
                    )
                    StatCard(
                        icon = Icons.Default.CalendarToday,
                        title = "Active rentals",
                        value = data.active_rentals.toString()
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                    Text(" revenue over time", fontWeight = FontWeight.Bold)
                    if (data.revenue_by_month.isEmpty()) {
                        Text("No Data available", color = Color.Gray)
                    } else {
                        LineChartComponent(data = data.revenue_by_month
                            .filter { !it.month.isNullOrEmpty() }
                            .associate { it.month to it.revenue.toFloat() })
                    }
                }


                item {
                    Spacer(modifier = Modifier.height(24.dp))
                    Text("Revenue by warehouse", fontWeight = FontWeight.Bold)
                    if (data.revenue_by_warehouse.isEmpty()) {
                        Text("No Data available", color = Color.Gray)
                    } else {
                        BarChartComponent(data = data.revenue_by_warehouse
                            .filter { !it.warehouse_name.isNullOrEmpty() }
                            .associate { it.warehouse_name to it.revenue.toFloat() })
                    }
                }
            }
        }
    }
}



@Composable
fun StatCard(icon: ImageVector, title: String, value: String) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, contentDescription = title, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(40.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(title, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            }
        }
    }
}


@Composable
fun TimeRangeDropdown(selected: String, onChange: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box {
        OutlinedButton(onClick = { expanded = true }) {
            Text(selected.uppercase())
        }
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            DropdownMenuItem(text = { Text("Week") }, onClick = {
                onChange("week")
                expanded = false
            })
            DropdownMenuItem(text = { Text("Month") }, onClick = {
                onChange("month")
                expanded = false
            })
            DropdownMenuItem(text = { Text("Year") }, onClick = {
                onChange("year")
                expanded = false
            })
        }
    }
}


@Composable
fun BarChartComponent(data: Map<String, Float>, modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            BarChart(context).apply {
                description.isEnabled = false
                legend.isEnabled = false
            }
        },
        modifier = modifier
            .fillMaxWidth()
            .height(300.dp)  // Set height as needed
    ) { chart ->
        val entries = data.entries.mapIndexed { index, entry ->
            BarEntry(index.toFloat(), entry.value)
        }
        val dataSet = BarDataSet(entries, "Revenue by Warehouse")
        dataSet.color = android.graphics.Color.BLUE
        val barData = BarData(dataSet)
        barData.barWidth = 0.9f

        chart.data = barData
        chart.xAxis.apply {
            granularity = 1f
            setDrawLabels(true)
            valueFormatter = IndexAxisValueFormatter(data.keys.toList())
            setDrawGridLines(false)
            position = com.github.mikephil.charting.components.XAxis.XAxisPosition.BOTTOM
        }
        chart.axisLeft.axisMinimum = 0f
        chart.axisRight.isEnabled = false
        chart.invalidate()
    }
}

@Composable
fun LineChartComponent(data: Map<String, Float>, modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            LineChart(context).apply {
                description.isEnabled = false
                legend.isEnabled = false
            }
        },
        modifier = modifier
            .fillMaxWidth()
            .height(300.dp)  // Set height
    ) { chart ->
        val entries = data.entries.mapIndexed { index, entry ->
            Entry(index.toFloat(), entry.value)
        }
        val dataSet = LineDataSet(entries, "Revenue Over Time")
        dataSet.color = android.graphics.Color.RED
        dataSet.setDrawCircles(true)
        dataSet.lineWidth = 2f

        val lineData = LineData(dataSet)

        chart.data = lineData
        chart.xAxis.apply {
            granularity = 1f
            setDrawLabels(true)
            valueFormatter = IndexAxisValueFormatter(data.keys.toList())
            setDrawGridLines(false)
            position = com.github.mikephil.charting.components.XAxis.XAxisPosition.BOTTOM
        }
        chart.axisLeft.axisMinimum = 0f
        chart.axisRight.isEnabled = false
        chart.invalidate()
    }
}

@Composable
fun PieChartComponent(data: Map<String, Float>, modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            PieChart(context).apply {
                description.isEnabled = false
                isDrawHoleEnabled = true
                setUsePercentValues(true)
                setEntryLabelColor(android.graphics.Color.BLACK)
                legend.isEnabled = true
            }
        },
        modifier = modifier
            .fillMaxWidth()
            .height(300.dp)  // Set height
    ) { chart ->
        val entries = data.entries.map { PieEntry(it.value, it.key) }
        val dataSet = PieDataSet(entries, "Revenue by Service")
        dataSet.colors = listOf(
            android.graphics.Color.BLUE,
            android.graphics.Color.RED,
            android.graphics.Color.GREEN,
            android.graphics.Color.YELLOW,
            android.graphics.Color.MAGENTA
        )
        val pieData = PieData(dataSet)
        pieData.setValueTextSize(12f)
        pieData.setValueTextColor(android.graphics.Color.BLACK)

        chart.data = pieData
        chart.invalidate()
    }
}