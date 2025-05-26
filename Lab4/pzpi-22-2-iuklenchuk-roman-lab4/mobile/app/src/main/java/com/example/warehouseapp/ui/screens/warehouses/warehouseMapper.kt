
package com.example.warehouseapp.ui.screens.warehouses
import  com.example.warehouseapp.data.WarehouseResponseSchema

fun WarehouseResponseSchema.toWarehouse(): Warehouse {
    return Warehouse(
        id = this.id,
        name = this.name ?: "No name",
        location = this.location,
        size_sqm = this.size_sqm ?: 0.0,
        price_per_day = this.price_per_day ?: 0.0,
        is_blocked = this.is_blocked ?: false
        // description = this.description ?: ""  // якщо є поле description
    )
}