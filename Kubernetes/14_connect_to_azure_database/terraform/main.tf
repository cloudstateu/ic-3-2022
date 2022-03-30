terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = "West Europe"
}

resource "azurerm_virtual_network" "main" {
  name                = "main-vn"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = ["10.1.0.0/16"]
}

# -----------------------------------------------------------------
# Postgres
# -----------------------------------------------------------------

resource "azurerm_subnet" "postgres" {
  name                 = "postgres-sn"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.1.0/24"]
  service_endpoints    = ["Microsoft.Storage"]
  delegation {
    name = "fs"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

resource "azurerm_private_dns_zone" "main" {
  name                = "my.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "main" {
  name                  = "main-vn-link"
  private_dns_zone_name = azurerm_private_dns_zone.main.name
  virtual_network_id    = azurerm_virtual_network.main.id
  resource_group_name   = azurerm_resource_group.main.name
}

resource "azurerm_postgresql_flexible_server" "postgres" {
  name                   = "psqlfs-azuresql-001"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "13"
  delegated_subnet_id    = azurerm_subnet.postgres.id
  private_dns_zone_id    = azurerm_private_dns_zone.main.id
  administrator_login    = "psqladmin"
  administrator_password = "H@Sh1CoR3!"
  storage_mb = 32768
  sku_name   = "B_Standard_B1ms"
  zone = "1"
  depends_on = [azurerm_private_dns_zone_virtual_network_link.main]
}

# -----------------------------------------------------------------
# Kubernetes
# -----------------------------------------------------------------

resource "azurerm_subnet" "kube" {
  name                 = "kube-sn"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.1.3.0/24"]
}

resource "azurerm_kubernetes_cluster" "example" {
  name                = "postgrescluster"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "cluster"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
    vnet_subnet_id = azurerm_subnet.kube.id
  }

  identity {
    type = "SystemAssigned"
  }
}