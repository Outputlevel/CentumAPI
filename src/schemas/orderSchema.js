import {  ProductService, CustomerService } from "../service/index.js";

export class OrderSchema                     {
    constructor(body){
        this.body = body;
        //this.centumService = new CentumService();
        this.productService = new ProductService();
        this.customerService = new CustomerService();
    }
    productInfo = async (product) => {
      const res = await this.productService.getArticuloByCode(product);
      //
      // console.log(res.payload)
      return res.payload;
    }
    orderSchema = () => {
        const body = this.body;
        return {
            order_id: Number(body.order_id),
            customer_id: Number(body.customer_id),
            cuit: String(body.billing_cuit),
            payment_method: String(body.payment_method),
            items: body.items.map(item => ({
                product_id: String(item.product_id),
                name: String(item.name),
                sku: String(item.sku),
                weight: Number(item.weight),
                price: Number(item.price),
                quantity: Number(item.quantity),
                subtotal: Number(item.subtotal),
                total: Number(item.total),
                discounts: Array.isArray(item.discounts) 
                    ? item.discounts.map(discount => Number(discount)) 
                    : [], // Ensures discounts are numbers or defaults to an empty array
            })),
            //meta_data: [], // Uncomment if needed
        };
    }
    orderPaymentMethod = (method) => {
      const methods = {
          bacs: 6090, //transferencia
          mercadoPago: 11365,
      };
  
      if (method.includes('bacs')) return methods.bacs;
      if (method.includes('mercado') || method.includes('pago')) return methods.mercadoPago;
      
      return null; // Return null if no match found
    }

     centumProductsForOrderSchema = async (customerID, products) => {
        const fecha = new Date();
        const formattedDate = fecha.toISOString();
        
        const productsArr = await Promise.all(products.map ( async (p)=>{
          let body = { "idCliente": customerID, "FechaDocumento": formattedDate, "Codigo": p.sku}
          //body.Codigo = p.sku;
          //console.log(body)
          const centumProductInfo =  await this.productInfo(body);
          //console.log(centumProductInfo);
            return {
                IdArticulo: centumProductInfo.IdArticulo, //Centum
                Codigo: centumProductInfo.Codigo, 
                Nombre: centumProductInfo.Nombre, 
                Weight_woo: p.weight,
                Cantidad_woo: p.quantity,
                Cantidad: Number(p.quantity * p.weight),
                /* SegundoControlStock: 0, */
                Precio: centumProductInfo.Precio, //Centum
                PorcentajeDescuento1: p.discounts[0] > 1 ? p.discounts[0] : 0,
                PorcentajeDescuento2: p.discounts[1] > 1 ? p.discounts[1] : 0,
                PorcentajeDescuento3: p.discounts[2] > 1 ? p.discounts[2] : 0,
                PorcentajeDescuentoMaximo: 99.999,
                CostoReposicion: centumProductInfo.CostoReposicion,
                CategoriaImpuestoIVA: {
                    IdCategoriaImpuestoIVA: centumProductInfo.CategoriaImpuestoIVA.IdCategoriaImpuestoIVA,
                    Codigo: centumProductInfo.CategoriaImpuestoIVA.Codigo,
                    Nombre: centumProductInfo.CategoriaImpuestoIVA.Nombre,
                    Tasa: centumProductInfo.CategoriaImpuestoIVA.Tasa
                },
                ImpuestoInterno: 0,
                NumeroTropa: "",
                NumeroSerie: "",
                DescuentoPromocion: 0,
                IdTipoDescuentoPromocion: 0,
                Observaciones: "",
                ClaseDescuento: {
                    IdClaseDescuento: 0
                },
                CantidadPedidosVenta: 0,
                CantidadOrdenesCompra: 0,
                StockComprometido: 0,
                StockDisponible: -5914.284,
                IdAgrupacion: 0,
                IdPromocionComercial: 0,
                EsSinCargo: false,
                EsArticuloAgrupador: false,
                CantidadUnitariaPorConjunto: 0,
                IdPedidoVentaItemAgrupador: 0,
                IdPedidoVentaItem: 134272
                  
            }
        })); 
        //console.log(productsArr);
        return productsArr;
    }


    centumOrderSchema = async (body) =>{
        const centumCustomerId = await this.customerService.getCustomerIdByCuit(body.cuit);
        const fecha = new Date();
        const formattedDate = fecha.toISOString();
        const productos = await this.centumProductsForOrderSchema(centumCustomerId, body.items) ?? [];
        return {
            //IdPedidoVenta: 31875,
            /* NumeroDocumento: {
              LetraDocumento: null,
              PuntoVenta: 1, //opcional
              Numero: 22313
            }, */
            woo_order_id: body.order_id,
            FechaDocumento: formattedDate,
            FechaEntrega: formattedDate,
            TurnoEntrega: {
              IdTurnoEntrega: 6083,
              Nombre: "Maniana"
            },
            Cliente: {
              IdCliente: centumCustomerId, //body. Dev Test Postman
              /* Codigo: "11030",
              RazonSocial: "Pablo R. Panero SAS",
              CUIT: "33717200999",
              Direccion: "Dean Funes 2578",
              Localidad: "San Francisco ",
              CodigoPostal: "2400",
              Provincia: {
                IdProvincia: 4705,
                Codigo: "CORDB",
                Nombre: "Cordoba"
              },
              Pais: {
                IdPais: 4657,
                Codigo: "ARG",
                Nombre: "Argentina"
              },
              Zona: {
                IdZona: 6095,
                Codigo: "08",
                Nombre: "Cordoba",
                Activo: true,
                EntregaLunes: false,
                EntregaMartes: false,
                EntregaMiercoles: false,
                EntregaJueves: false,
                EntregaViernes: false,
                EntregaSabado: false,
                EntregaDomingo: false,
                DemoraEnHorasFechaEntrega: 0,
                CostoEntrega: 0
              },
              Latitud: 0,
              Longitud: 0,
              DireccionEntrega: "Dean Funes 2578",
              CalleEntrega: "Dean funes",
              NumeroCalleEntrega: "2578",
              LocalEntrega: null,
              CallePerpendicular1Entrega: null,
              CallePerpendicular2Entrega: null,
              LocalidadEntrega: "San Francisco ",
              CodigoPostalEntrega: "2400",
              DepartamentoEntrega: null,
              ProvinciaEntrega: {
                IdProvincia: 4705,
                Codigo: "CORDB",
                Nombre: "Cordoba"
              },
              PaisEntrega: {
                IdPais: 4657,
                Codigo: "ARG",
                Nombre: "Argentina"
              },
              ZonaEntrega: {
                IdZona: 6095,
                Codigo: "08",
                Nombre: "Cordoba",
                Activo: true,
                EntregaLunes: false,
                EntregaMartes: false,
                EntregaMiercoles: false,
                EntregaJueves: false,
                EntregaViernes: false,
                EntregaSabado: false,
                EntregaDomingo: false,
                DemoraEnHorasFechaEntrega: 0,
                CostoEntrega: 0
              },
              LatitudEntrega: 0,
              LongitudEntrega: 0,
              Telefono: "3564 472323",
              TelefonoAlternativo: null,
              Fax: null,
              Interno: null,
              Email: "paneropablo@gmail.com",
              ObservacionesCliente: null,
              CondicionIVA: {
                IdCondicionIVA: 1895,
                Codigo: "RI",
                Nombre: "Responsable Inscripto"
              },
              CondicionVenta: {
                IdCondicionVenta: 15,
                Codigo: "VTA8",
                Nombre: "Cuenta Corriente 30 dias"
              },
              Vendedor: {
                IdVendedor: 2,
                Codigo: "V0001",
                Nombre: "Ventas Directas",
                CUIT: null,
                Direccion: null,
                Localidad: null,
                Telefono: null,
                Mail: null,
                EsSupervisor: false
              },
              Transporte: {
                IdTransporte: 14,
                Codigo: "14",
                RazonSocial: "ROSSI PABLO EZEQUIEL",
                Direccion: "28 de Julio 3895 - Barrio Panamericano",
                Localidad: "Cordoba",
                CodigoPostal: null,
                Provincia: {
                  IdProvincia: 4705,
                  Codigo: "CORDB",
                  Nombre: "Cordoba"
                },
                Pais: {
                  IdPais: 4657,
                  Codigo: "ARG",
                  Nombre: "Argentina"
                },
                DireccionEntrega: null,
                LocalidadEntrega: null,
                CodigoPostalEntrega: null,
                ProvinciaEntrega: null,
                PaisEntrega: null,
                ZonaEntrega: null,
                Telefono: "+54 9 351 393 9860",
                NumeroDocumento: "20318689521",
                Email: null,
                TipoDocumento: {
                  IdTipoDocumento: 6028,
                  Codigo: "DNI",
                  Nombre: "Documento Nacional de Identidad"
                }
              },
              Bonificacion: {
                IdBonificacion: 6237,
                Codigo: "B.15%",
                Calculada: 0.15
              },
              LimiteCredito: {
                IdLimiteCredito: 46002,
                Nombre: "Limite Credito 1",
                Valor: 0
              },
              ClaseCliente: {
                IdClaseCliente: 7931,
                Codigo: "DIST",
                Nombre: "Distribuidores Congelados"
              },
              ConceptoVenta: null,
              FrecuenciaCliente: {
                IdFrecuenciaCliente: 7912,
                Nombre: "Mensual"
              },
              VisitaRegularDiaSemanaLunes: false,
              VisitaRegularDiaSemanaMartes: false,
              VisitaRegularDiaSemanaMiercoles: false,
              VisitaRegularDiaSemanaJueves: false,
              VisitaRegularDiaSemanaViernes: false,
              VisitaRegularDiaSemanaSabado: false,
              VisitaRegularDiaSemanaDomingo: false,
              PoseeMostradorExclusivo: false,
              CanalCliente: {
                IdCanalCliente: 6899,
                Codigo: "GCY",
                Nombre: "Grocery"
              },
              CadenaCliente: {
                IdCadenaCliente: 6920,
                Codigo: "365",
                Nombre: "365"
              },
              UbicacionCliente: {
                IdUbicacionCliente: 6942,
                Codigo: "BAR",
                Nombre: "Zona de Bares y Boliches"
              },
              EdadesPromedioConsumidoresCliente: {
                IdEdadesPromedioConsumidoresCliente: 6951,
                Codigo: "111",
                Nombre: "Hay igual cantidad de consumidores"
              },
              GeneroPromedioConsumidoresCliente: {
                IdGeneroPromedioConsumidoresCliente: 6964,
                Codigo: "11",
                Nombre: "Hay igual cantidad de consumidores"
              },
              DiasAtencionCliente: {
                IdDiasAtencionCliente: 6969,
                Codigo: "LD",
                Nombre: "Lunes a Domingo"
              },
              HorarioAtencionCliente: {
                IdHorarioAtencionCliente: 6970,
                Codigo: "D",
                Nombre: "Diurno"
              },
              CigarreraCliente: {
                IdCigarreraCliente: 6972,
                Codigo: "MSP",
                Nombre: "Massalin Particulares"
              },
              ListaPrecio: {
                IdListaPrecio: 1,
                Codigo: "MN",
                Descripcion: "Mercado Nacional",
                Habilitado: true,
                FechaDesde: null,
                FechaHasta: null,
                PorcentajePrecioSugerido: 0,
                Moneda: {
                  IdMoneda: 1,
                  Codigo: "ARS",
                  Nombre: "Peso Argentino",
                  Cotizacion: 1
                },
                ListaPrecioAlternativa: null
              },
              DiasMorosidad: 30,
              DiasIncobrables: 180,
              EsClienteMassalin: false,
              TipoIncoterm: null,
              ImporteMinimoPedido: 0,
              ContactoEnvioComprobanteEmpresa: [
                {
                  Email: "paneropablo@gmail.com",
                  IdsActividad: [
                    3
                  ],
                  Celular: ""
                }
              ],
              Activo: true,
              FechaAltaCliente: "2022-08-01T00:00:00",
              CondicionIIBB: {
                IdCondicionIIBB: 6052,
                Codigo: "Convenio Multilatera"
              },
              NumeroIIBB: null */
            },
            Vendedor: {
              IdVendedor: 10, //CONOSUD
            },
            Bonificacion: {
              IdBonificacion: 6235, //B.0%
            },
            PorcentajeDescuento: 0,
            Observaciones: "",
            TipoVenta: null,
            PedidoVentaArticulos: productos,
            PedidoVentaEstados: [
              {
                IdPedidoVentaEstado: 177014,
                Estado: {
                  IdEstado: 10317,
                  Codigo: "1",
                  Nombre: "Pendiente de Preparar"
                },
                Detalle: "Alta de Pedido de Venta",
                FechaCreacion: "2024-08-08T11:53:38.493",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 177015,
                Estado: {
                  IdEstado: 10318,
                  Codigo: "2",
                  Nombre: "En Preparación"
                },
                Detalle: "Preparación Iniciada - Preparador/es: Alarcon Raul",
                FechaCreacion: "2024-08-08T11:57:25.663",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 177016,
                Estado: {
                  IdEstado: 10319,
                  Codigo: "3",
                  Nombre: "Preparado"
                },
                Detalle: "Preparación Finalizada",
                FechaCreacion: "2024-08-08T11:57:31.803",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 177017,
                Estado: {
                  IdEstado: 10321,
                  Codigo: "5",
                  Nombre: "Suscripto Total"
                },
                Detalle: "Alta de Remito Venta 00001-00062317",
                FechaCreacion: "2024-08-08T11:59:24.413",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 177096,
                Estado: {
                  IdEstado: 10322,
                  Codigo: "6",
                  Nombre: "Asignado a Guía"
                },
                Detalle: "Asignado a Guía: 3491 - CÓRDOBA S.32",
                FechaCreacion: "2024-08-09T07:26:43.933",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 177101,
                Estado: {
                  IdEstado: 10323,
                  Codigo: "7",
                  Nombre: "Despachado"
                },
                Detalle: "Despacho de Guía: 3491 - CÓRDOBA S.32",
                FechaCreacion: "2024-08-09T07:37:04.447",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              },
              {
                IdPedidoVentaEstado: 178234,
                Estado: {
                  IdEstado: 10324,
                  Codigo: "8",
                  Nombre: "Cumplido"
                },
                Detalle: "Guía: 3491 - CÓRDOBA S.32",
                FechaCreacion: "2024-08-19T11:10:47.393",
                IdSubEstadoPedidoVenta: 0,
                DetalleSubEstadoPedidoVenta: ""
              }
            ],
            //siempre, seccion deposito en piso
            SucursalFisica: {
              IdSucursalFisica: 6086,
              Codigo: "01",
              Nombre: "DESVIO ARIJÓN",
            },
            /* DivisionEmpresaGrupoEconomico: {
              IdDivisionEmpresaGrupoEconomico: 1,
              RazonSocialEmpresaGrupoEconomico: "Conosud SA",
              NombreDivisionEmpresa: "Empresa"
            }, */
            /* TiendaOnline: {
              IdTiendaOnline: 0,
              Nombre: null,
              IdTiendaOnlineOrden: "WALLER"
            }, */
            IdCobro: null,
            /* Transporte: {
              IdTransporte: 14,
              Codigo: "14",
              RazonSocial: "ROSSI PABLO EZEQUIEL",
              Direccion: "28 de Julio 3895 - Barrio Panamericano",
              Localidad: "Cordoba",
              CodigoPostal: null,
              Provincia: {
                IdProvincia: 4705,
                Codigo: "CORDB",
                Nombre: "Cordoba"
              },
              Pais: {
                IdPais: 4657,
                Codigo: "ARG",
                Nombre: "Argentina"
              },
              DireccionEntrega: null,
              LocalidadEntrega: null,
              CodigoPostalEntrega: null,
              ProvinciaEntrega: null,
              PaisEntrega: null,
              ZonaEntrega: null,
              Telefono: "+54 9 351 393 9860",
              NumeroDocumento: "20318689521",
              Email: null,
              TipoDocumento: {
                IdTipoDocumento: 6028,
                Codigo: "DNI",
                Nombre: "Documento Nacional de Identidad"
              }
            }, */
            FechaVencimiento: formattedDate,
            Nota: "",
            ObservacionesInternas: "",
            CondicionVenta: {
              IdCondicionVenta: 15,
              Codigo: "VTA8",
              Nombre: "Cuenta Corriente 30 dias"
            },
            //Ver funcion
            FormaPagoCliente: {
              IdFormaPagoCliente: this.orderPaymentMethod(body.payment_method),
              //Nombre: "Mercado Pago",
            },
            ContieneConjunto: false,
            Moneda: {
              IdMoneda: 1,
              Codigo: "ARS",
              Nombre: "Peso Argentino",
              Cotizacion: 1
            },
            Cotizacion: 1,
            EmpresaDireccionCliente: {
              IdEmpresaDireccionCliente: 0,
              Empresa: {
                IdEmpresa: 0,
                Codigo: "",
                RazonSocial: "",
                Direccion: "",
                Localidad: "",
                Telefono: "",
                TelefonoAlternativo: "",
                Fax: "",
                Interno: "",
                CodigoPostal: "",
                CUIT: "",
                Email: "",
                CondicionIVA: {
                  IdCondicionIVA: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                Provincia: {
                  IdProvincia: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Activo: false,
                  ProvinciaRemitoElectronico: {
                    IdProvinciaRemitoElectronico: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  TipoPadron: 0
                },
                Pais: {
                  IdPais: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Activo: false
                },
                EsCliente: false,
                EsProveedor: false,
                EsBanco: false,
                Activo: false,
                Zona: {
                  IdZona: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false,
                  EntregaLunes: false,
                  EntregaMartes: false,
                  EntregaMiercoles: false,
                  EntregaJueves: false,
                  EntregaViernes: false,
                  EntregaSabado: false,
                  EntregaDomingo: false,
                  DemoraEnHorasFechaEntrega: 0,
                  CostoEntrega: 0
                },
                NumeroIIBB: "",
                CondicionIIBB: {
                  IdCondicionIIBB: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                CategoriaIIBB: {
                  IdCategoriaIIBB: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                Moneda: {
                  IdMoneda: 0,
                  Codigo: "",
                  Descripcion: "",
                  Simbolo: "",
                  Cotizacion: 0,
                  MonedaFacturacionElectronica: {
                    IdMonedaFacturacionElectronica: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  }
                },
                CuentaCliente: {
                  IdCuenta: 0,
                  Codigo: "",
                  Descripcion: "",
                  Capitulo: 0,
                  ColumnaBalance: 0,
                  Imputable: false,
                  Habilitada: false,
                  CentroCostos: false,
                  AjustablePorInflacion: false,
                  EsMonetaria: false,
                  Indice: 0,
                  CuentaPadre: null,
                  EsSubCuenta: false
                },
                ClienteCuentaCorriente: null,
                MargenBrutoMinimo: 0,
                RequiereAutorizacionPedidoVenta: false,
                Recepcion: "",
                MensajeEntrega: "",
                Abasto: {
                  IdAbasto: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                FrecuenciaCliente: {
                  IdFrecuenciaCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                VisitaRegularDiaSemanaLunes: false,
                VisitaRegularDiaSemanaMartes: false,
                VisitaRegularDiaSemanaMiercoles: false,
                VisitaRegularDiaSemanaJueves: false,
                VisitaRegularDiaSemanaViernes: false,
                VisitaRegularDiaSemanaSabado: false,
                VisitaRegularDiaSemanaDomingo: false,
                PoseeMostradorExclusivo: false,
                CanalCliente: {
                  IdCanalCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                CadenaCliente: {
                  IdCadenaCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                UbicacionCliente: {
                  IdUbicacionCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                EdadesPromedioConsumidoresCliente: {
                  IdEdadesPromedioConsumidoresCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                GeneroPromedioConsumidoresCliente: {
                  IdGeneroPromedioConsumidoresCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                DiasAtencionCliente: {
                  IdDiasAtencionCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                HorarioAtencionCliente: {
                  IdHorarioAtencionCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                CigarreraCliente: {
                  IdCigarreraCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                ClienteDiasMorosidad: 0,
                ClienteDiasIncobrables: 0,
                CalcularClienteSaldoActual: false,
                CalcularClienteSaldoFuturo: false,
                TipoVenta: {
                  IdTipoVenta: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                DescuentoPorVolumen: {
                  IdDescuentoPorVolumen: 0,
                  Nombre: "",
                  TipoActualizacionDescuento: 0,
                  Activo: false
                },
                TipoIncoterm: {
                  IdTipoIncoterm: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                ImporteMinimoPedido: 0,
                FechaRecuperacion: "0001-01-01T00:00:00",
                PorcentajeSegmentacion: 0,
                DireccionEntrega: "",
                Mailing: false,
                EsEsporadico: false,
                CondicionVenta: {
                  IdCondicionVentaPago: 0,
                  Codigo: "",
                  Descripcion: "",
                  TipoCondicion: 0,
                  DiasCredito: 0,
                  Circuito: 0,
                  SugiereVentaCuentaCorriente: false,
                  DiasDescuentoProntoPago: 0,
                  DescuentoProntoPago: 0,
                  Activo: false
                },
                Observaciones: "",
                LocalidadEntrega: "",
                CodigoPostalEntrega: "",
                ProvinciaEntrega: {
                  IdProvincia: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Activo: false,
                  ProvinciaRemitoElectronico: {
                    IdProvinciaRemitoElectronico: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  TipoPadron: 0
                },
                PaisEntrega: {
                  IdPais: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Activo: false
                },
                ZonaEntrega: {
                  IdZona: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false,
                  EntregaLunes: false,
                  EntregaMartes: false,
                  EntregaMiercoles: false,
                  EntregaJueves: false,
                  EntregaViernes: false,
                  EntregaSabado: false,
                  EntregaDomingo: false,
                  DemoraEnHorasFechaEntrega: 0,
                  CostoEntrega: 0
                },
                CalleEntrega: "",
                NumeroCalleEntrega: "",
                PisoEntrega: "",
                LocalEntrega: "",
                DepartamentoEntrega: {
                  IdDepartamento: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Provincia: {
                    IdProvincia: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Pais: {
                      IdPais: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Activo: false
                    },
                    Activo: false,
                    ProvinciaRemitoElectronico: {
                      IdProvinciaRemitoElectronico: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoPadron: 0
                  },
                  Activo: false,
                  IdDepartamentoCensal: 0
                },
                CallePerpendicular1Entrega: "",
                CallePerpendicular2Entrega: "",
                Latitud: 0,
                Longitud: 0,
                LatitudEntrega: 0,
                LongitudEntrega: 0,
                FechaActualizacion: "0001-01-01T00:00:00",
                HotSale: false,
                Merchandiser: false,
                CodigoCRM: "",
                FechaActualizacionCRM: "0001-01-01T00:00:00",
                FechaAltaCliente: "0001-01-01T00:00:00",
                FechaBajaCliente: "0001-01-01T00:00:00",
                CategoriaCliente: {
                  IdCategoriaCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                ListaPrecio: {
                  IdListaPrecio: 0,
                  Codigo: "",
                  Descripcion: "",
                  Habilitado: false,
                  FechaDesde: "0001-01-01T00:00:00",
                  FechaHasta: "0001-01-01T00:00:00",
                  ListaPrecioAlternativa: null,
                  PorcentajePrecioSugerido: 0,
                  Moneda: {
                    IdMoneda: 0,
                    Codigo: "",
                    Descripcion: "",
                    Simbolo: "",
                    Cotizacion: 0,
                    MonedaFacturacionElectronica: {
                      IdMonedaFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    }
                  }
                },
                Vendedor: {
                  IdVendedor: 0,
                  Codigo: "",
                  Nombre: "",
                  Direccion: "",
                  Telefono: "",
                  Celular: "",
                  Email: "",
                  Observaciones: "",
                  CUIT: "",
                  Localidad: "",
                  ComisionPorcentajeVentaContado: 0,
                  ComisionPorcentajeVentaCuentaCorriente: 0,
                  ComisionPorcentajeVentaCobrada: 0,
                  Usuario: {
                    IdUsuario: 0,
                    Implementacion: {
                      IdImplementacion: 0,
                      Nombre: "",
                      Dominio: "",
                      NombreBaseDatos: ""
                    },
                    UsuarioAcceso: "",
                    Contrasena: "",
                    Nombre: "",
                    NivelUsuario: {
                      IdNivelUsuario: 0,
                      Nombre: "",
                      Implementacion: {
                        IdImplementacion: 0,
                        Nombre: "",
                        Dominio: "",
                        NombreBaseDatos: ""
                      }
                    },
                    Email: "",
                    UrlCarpetaGoogleDrive: "",
                    FechaPrimerLoginUltimaVersion: "0001-01-01T00:00:00",
                    CantidadIntentosFallidosConsecutivos: 0,
                    Bloqueado: false
                  },
                  SucursalFisica: {
                    IdSucursalFisica: 0,
                    Codigo: "",
                    Nombre: "",
                    Activa: false,
                    IdServicio: 0,
                    Provincia: {
                      IdProvincia: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Pais: {
                        IdPais: 0,
                        Codigo: "",
                        Nombre: "",
                        Latitud: 0,
                        Longitud: 0,
                        Activo: false
                      },
                      Activo: false,
                      ProvinciaRemitoElectronico: {
                        IdProvinciaRemitoElectronico: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      TipoPadron: 0
                    },
                    Planta: "",
                    Puerta: "",
                    Numero: 0,
                    Direccion: "",
                    Localidad: "",
                    CodigoPostal: "",
                    CentroCostos: {
                      IdCentroCostos: 0,
                      Codigo: "",
                      Nombre: "",
                      ResumenCentroCostos: {
                        IdResumenCentroCostos: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      Activo: false
                    },
                    AplicaCentroCostosDefectoEnCompras: false,
                    AplicaCentroCostosDefectoEnFlujosFondos: false,
                    Calle: null,
                    NumeroCalle: 0,
                    OperaPreparacionArticulosPalletsArticulosPorSeparado: false
                  },
                  EsSupervisor: false,
                  CanalVenta: {
                    IdCanalVenta: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  Activo: false,
                  CodigoPostal: "",
                  Provincia: {
                    IdProvincia: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Pais: {
                      IdPais: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Activo: false
                    },
                    Activo: false,
                    ProvinciaRemitoElectronico: {
                      IdProvinciaRemitoElectronico: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoPadron: 0
                  },
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  JefeVentas: {
                    IdJefeVentas: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  ReduccionPorcentajeVentaCobradaFueraTermino: 0,
                  RecibeEmailPedidoVentaGenerados: false
                },
                Transporte: {
                  IdTransporte: 0,
                  Codigo: "",
                  RazonSocial: "",
                  Direccion: "",
                  Localidad: "",
                  CodigoPostal: "",
                  Telefono: "",
                  NumeroDocumento: "",
                  TipoDocumento: {
                    IdTipoDocumento: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  DireccionEntrega: "",
                  Email: "",
                  Activo: false,
                  LocalidadEntrega: "",
                  CodigoPostalEntrega: "",
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Provincia: {
                    IdProvincia: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Pais: {
                      IdPais: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Activo: false
                    },
                    Activo: false,
                    ProvinciaRemitoElectronico: {
                      IdProvinciaRemitoElectronico: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoPadron: 0
                  },
                  PaisEntrega: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  ProvinciaEntrega: {
                    IdProvincia: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Pais: {
                      IdPais: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Activo: false
                    },
                    Activo: false,
                    ProvinciaRemitoElectronico: {
                      IdProvinciaRemitoElectronico: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoPadron: 0
                  },
                  ZonaEntrega: {
                    IdZona: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false,
                    EntregaLunes: false,
                    EntregaMartes: false,
                    EntregaMiercoles: false,
                    EntregaJueves: false,
                    EntregaViernes: false,
                    EntregaSabado: false,
                    EntregaDomingo: false,
                    DemoraEnHorasFechaEntrega: 0,
                    CostoEntrega: 0
                  },
                  Patente: "",
                  PatenteAcoplado: ""
                },
                ClaseCliente: {
                  IdClaseCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                Bonificacion: {
                  IdBonificacion: 0,
                  Codigo: "",
                  TipoTasaComision: {
                    IdTipoTasaComision: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  Calculada: 0,
                  Bonificacion1: 0,
                  Bonificacion2: 0,
                  Bonificacion3: 0,
                  Bonificacion4: 0,
                  Bonificacion5: 0,
                  Bonificacion6: 0,
                  Activo: false
                },
                ConceptoVenta: {
                  IdConceptoCompraVenta: 0,
                  Codigo: "",
                  Nombre: "",
                  Circuito: 0,
                  CategoriaImpuestoIVA: {
                    IdCategoriaImpuestoIVA: 0,
                    Codigo: "",
                    Nombre: "",
                    Tasa: 0,
                    CategoriaImpuestoIVAFacturacionElectronica: {
                      IdCategoriaImpuestoIVAFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    IdCategoriaImpuestoIVASegmentado: 0
                  },
                  RubroCreditoFiscal: {
                    IdRubroCreditoFiscal: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  ImputacionCreditoFiscal: {
                    IdImputacionCreditoFiscal: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  BienDeUso: false,
                  Activo: false,
                  ConceptoFacturacionElectronica: {
                    IdConceptoFacturacionElectronica: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  ResumenConceptoCompraVenta: {
                    IdResumenConceptoCompraVenta: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  }
                },
                LimiteCredito: {
                  IdLimiteCredito: 0,
                  Nombre: "",
                  Valor: 0,
                  BloquearPorComprobanteVencido: false
                },
                FormaPagoCliente: {
                  IdFormaPagoCliente: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                CondicionGanancias: {
                  IdCondicionGanancias: 0,
                  Nombre: "",
                  Descripcion: "",
                  CodigoRegimen: "",
                  AlicuotaRetencionAInscriptos: 0,
                  AlicuotaRetencionANoInscriptos: 0,
                  AlicuotaRetencionAMonotributos: 0,
                  ImporteMinimoNoImponible: 0,
                  ImporteMinimoNoImponibleMonotributos: 0,
                  UtilizaEscala: false,
                  CodigoCondicion: 0,
                  CodigoCondicionNoInscripto: 0
                },
                CondicionPago: {
                  IdCondicionVentaPago: 0,
                  Codigo: "",
                  Descripcion: "",
                  TipoCondicion: 0,
                  DiasCredito: 0,
                  Circuito: 0,
                  SugiereVentaCuentaCorriente: false,
                  DiasDescuentoProntoPago: 0,
                  DescuentoProntoPago: 0,
                  Activo: false
                },
                FormaPagoProveedor: {
                  IdFormaPagoProveedor: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                ClaseProveedor: {
                  IdClaseProveedor: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                ConceptoCompra: {
                  IdConceptoCompraVenta: 0,
                  Codigo: "",
                  Nombre: "",
                  Circuito: 0,
                  CategoriaImpuestoIVA: {
                    IdCategoriaImpuestoIVA: 0,
                    Codigo: "",
                    Nombre: "",
                    Tasa: 0,
                    CategoriaImpuestoIVAFacturacionElectronica: {
                      IdCategoriaImpuestoIVAFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    IdCategoriaImpuestoIVASegmentado: 0
                  },
                  RubroCreditoFiscal: {
                    IdRubroCreditoFiscal: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  ImputacionCreditoFiscal: {
                    IdImputacionCreditoFiscal: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  BienDeUso: false,
                  Activo: false,
                  ConceptoFacturacionElectronica: {
                    IdConceptoFacturacionElectronica: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  ResumenConceptoCompraVenta: {
                    IdResumenConceptoCompraVenta: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  }
                },
                CategoriaGanancias: {
                  IdCategoriaGanancias: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                CuentaProveedor: {
                  IdCuenta: 0,
                  Codigo: "",
                  Descripcion: "",
                  Capitulo: 0,
                  ColumnaBalance: 0,
                  Imputable: false,
                  Habilitada: false,
                  CentroCostos: false,
                  AjustablePorInflacion: false,
                  EsMonetaria: false,
                  Indice: 0,
                  CuentaPadre: null,
                  EsSubCuenta: false
                },
                DescuentoProveedor: {
                  IdDescuentoProveedor: 0,
                  Codigo: "",
                  Calculado: 0,
                  Descuento1: 0,
                  Descuento2: 0,
                  Descuento3: 0,
                  Descuento4: 0,
                  Descuento5: 0,
                  Descuento6: 0,
                  Activo: false
                },
                NumeroAgentePercepcionRetencionIIBBCABA: "",
                ProveedorCuentaCorriente: null,
                PorcentajeExencionImpuestoGanancias: 0,
                FechaDesdeExencionImpuestoGanancias: "0001-01-01T00:00:00",
                FechaHastaExencionImpuestoGanancias: "0001-01-01T00:00:00",
                FechaActualizacionPadronExencionImpuestoGanancias: "0001-01-01T00:00:00",
                CategoriaRetencionIVA: {
                  IdCategoriaRetencionIVA: 0,
                  Nombre: "",
                  CodigoRegimen: "",
                  AlicuotaRetencionDiscriminaIVA: 0,
                  ImporteMinimoNoImponibleDiscriminaIVA: 0,
                  ImporteMinimoParaHacerRetencionDiscriminaIVA: 0,
                  AlicuotaRetencionNoDiscriminaIVA: 0,
                  ImporteMinimoNoImponibleNoDiscriminaIVA: 0,
                  ImporteMinimoParaHacerRetencionNoDiscriminaIVA: 0,
                  ImporteMaximoExportadoresRetieneTotalIVA: 0,
                  CodigoCondicion: 0,
                  CodigoCondicionNoInscripto: 0
                },
                CategoriaRetencionSUSS: {
                  IdCategoriaRetencionSUSS: 0,
                  Nombre: "",
                  CodigoRegimen: "",
                  AlicuotaRetencionDiscriminaIVA: 0,
                  ImporteMinimoNoImponibleDiscriminaIVA: 0,
                  ImporteMinimoParaHacerRetencionDiscriminaIVA: 0,
                  AlicuotaRetencionNoDiscriminaIVA: 0,
                  ImporteMinimoNoImponibleNoDiscriminaIVA: 0,
                  ImporteMinimoParaHacerRetencionNoDiscriminaIVA: 0,
                  ImporteMinimoNoImponibleExportadores: 0,
                  ImporteMinimoParaHacerRetencionExportadores: 0
                },
                PorcentajeExencionIVA: 0,
                FechaDesdeExencionIVA: "0001-01-01T00:00:00",
                FechaHastaExencionIVA: "0001-01-01T00:00:00",
                PorcentajeExencionSUSS: 0,
                FechaDesdeExencionSUSS: "0001-01-01T00:00:00",
                FechaHastaExencionSUSS: "0001-01-01T00:00:00",
                RequiereAutorizacionOrdenCompra: false,
                RequiereAutorizacionCompra: false,
                RequiereAutorizacionAvisoPago: false,
                TipoClaveAutorizacion: {
                  IdTipoClaveAutorizacion: 0,
                  Codigo: 0,
                  Nombre: "",
                  Activo: false
                },
                ClaveAutorizacion: "",
                ClaveAutorizacionFechaVencimiento: "0001-01-01T00:00:00",
                ProveedorDiasMorosidad: 0,
                ProveedorDiasIncobrables: 0,
                ProveedorDiasEntrega: 0,
                CausalNoRetencion: "",
                CuentaBanco: {
                  IdCuenta: 0,
                  Codigo: "",
                  Descripcion: "",
                  Capitulo: 0,
                  ColumnaBalance: 0,
                  Imputable: false,
                  Habilitada: false,
                  CentroCostos: false,
                  AjustablePorInflacion: false,
                  EsMonetaria: false,
                  Indice: 0,
                  CuentaPadre: null,
                  EsSubCuenta: false
                },
                FechaCreacion: "0001-01-01T00:00:00",
                EsClienteMassalin: false,
                Usuario: {
                  IdUsuario: 0,
                  Implementacion: {
                    IdImplementacion: 0,
                    Nombre: "",
                    Dominio: "",
                    NombreBaseDatos: ""
                  },
                  UsuarioAcceso: "",
                  Contrasena: "",
                  Nombre: "",
                  NivelUsuario: {
                    IdNivelUsuario: 0,
                    Nombre: "",
                    Implementacion: {
                      IdImplementacion: 0,
                      Nombre: "",
                      Dominio: "",
                      NombreBaseDatos: ""
                    }
                  },
                  Email: "",
                  UrlCarpetaGoogleDrive: "",
                  FechaPrimerLoginUltimaVersion: "0001-01-01T00:00:00",
                  CantidadIntentosFallidosConsecutivos: 0,
                  Bloqueado: false
                },
                ClienteVentaMassalin: null,
                TipoCategoriaReceptorRemitoElectronicoCarnico: {
                  IdTipoCategoriaReceptorRemitoElectronicoCarnico: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                EsGranContribuyente: false,
                TributoParticularPercepcion: {
                  IdTributoParticular: 0,
                  Nombre: null,
                  AlicuotaPercepcion: 0,
                  AlicuotaRetencion: 0,
                  MinimoNoImponiblePercepcion: 0,
                  MinimoNoImponibleRetencion: 0,
                  TotalVentaMinimo: 0,
                  TotalOrdenPagoMinimo: 0,
                  MontoMinimoPercepcion: 0,
                  MontoMinimoRetencion: 0,
                  RegimenEspecial: {
                    IdRegimenEspecial: 0,
                    Codigo: "",
                    Descripcion: "",
                    Impuesto: {
                      IdImpuesto: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoRegimenEspecial: {
                      IdTipoRegimenEspecial: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    RegimenSIAP: {
                      IdRegimenSIAP: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    Computo: 0,
                    CondicionSICORE: {
                      IdCondicionSICORE: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    Habilitado: false,
                    Cuenta: {
                      IdCuenta: 0,
                      Codigo: "",
                      Descripcion: "",
                      Capitulo: 0,
                      ColumnaBalance: 0,
                      Imputable: false,
                      Habilitada: false,
                      CentroCostos: false,
                      AjustablePorInflacion: false,
                      EsMonetaria: false,
                      Indice: 0,
                      CuentaPadre: null,
                      EsSubCuenta: false
                    },
                    RegimenEspecialFacturacionElectronica: {
                      IdRegimenEspecialFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    CentroCostos: {
                      IdCentroCostos: 0,
                      Codigo: "",
                      Nombre: "",
                      ResumenCentroCostos: {
                        IdResumenCentroCostos: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      Activo: false
                    },
                    CodigoImpuesto: "",
                    AplicaVentaBienDeUso: false,
                    Compra: false,
                    Venta: false
                  },
                  TipoRetencion: {
                    IdTipoRetencion: 0,
                    Codigo: "",
                    Nombre: "",
                    IdTipoImpuesto: 0,
                    Provincia: {
                      IdProvincia: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Pais: {
                        IdPais: 0,
                        Codigo: "",
                        Nombre: "",
                        Latitud: 0,
                        Longitud: 0,
                        Activo: false
                      },
                      Activo: false,
                      ProvinciaRemitoElectronico: {
                        IdProvinciaRemitoElectronico: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      TipoPadron: 0
                    },
                    BaseImponible: 0,
                    PorcentajeRetencion: 0,
                    ImporteMinimo: 0,
                    Cuenta: {
                      IdCuenta: 0,
                      Codigo: "",
                      Descripcion: "",
                      Capitulo: 0,
                      ColumnaBalance: 0,
                      Imputable: false,
                      Habilitada: false,
                      CentroCostos: false,
                      AjustablePorInflacion: false,
                      EsMonetaria: false,
                      Indice: 0,
                      CuentaPadre: null,
                      EsSubCuenta: false
                    },
                    Activo: false,
                    Pagos: false,
                    Cobros: false,
                    OrdenPagoTotalMinimo: 0,
                    PuntoVentaCertificadoRetencion: 0,
                    CodigoImpuesto: ""
                  },
                  AplicaEnNotasDebitoTotales: false,
                  AplicaEnNotasDebitoParciales: false,
                  AplicaEnNotasCreditoTotales: false,
                  AplicaEnNotasCreditoParciales: false,
                  Activo: false
                },
                TributoParticularRetencion: {
                  IdTributoParticular: 0,
                  Nombre: null,
                  AlicuotaPercepcion: 0,
                  AlicuotaRetencion: 0,
                  MinimoNoImponiblePercepcion: 0,
                  MinimoNoImponibleRetencion: 0,
                  TotalVentaMinimo: 0,
                  TotalOrdenPagoMinimo: 0,
                  MontoMinimoPercepcion: 0,
                  MontoMinimoRetencion: 0,
                  RegimenEspecial: {
                    IdRegimenEspecial: 0,
                    Codigo: "",
                    Descripcion: "",
                    Impuesto: {
                      IdImpuesto: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoRegimenEspecial: {
                      IdTipoRegimenEspecial: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    RegimenSIAP: {
                      IdRegimenSIAP: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    Computo: 0,
                    CondicionSICORE: {
                      IdCondicionSICORE: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    Habilitado: false,
                    Cuenta: {
                      IdCuenta: 0,
                      Codigo: "",
                      Descripcion: "",
                      Capitulo: 0,
                      ColumnaBalance: 0,
                      Imputable: false,
                      Habilitada: false,
                      CentroCostos: false,
                      AjustablePorInflacion: false,
                      EsMonetaria: false,
                      Indice: 0,
                      CuentaPadre: null,
                      EsSubCuenta: false
                    },
                    RegimenEspecialFacturacionElectronica: {
                      IdRegimenEspecialFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    CentroCostos: {
                      IdCentroCostos: 0,
                      Codigo: "",
                      Nombre: "",
                      ResumenCentroCostos: {
                        IdResumenCentroCostos: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      Activo: false
                    },
                    CodigoImpuesto: "",
                    AplicaVentaBienDeUso: false,
                    Compra: false,
                    Venta: false
                  },
                  TipoRetencion: {
                    IdTipoRetencion: 0,
                    Codigo: "",
                    Nombre: "",
                    IdTipoImpuesto: 0,
                    Provincia: {
                      IdProvincia: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Pais: {
                        IdPais: 0,
                        Codigo: "",
                        Nombre: "",
                        Latitud: 0,
                        Longitud: 0,
                        Activo: false
                      },
                      Activo: false,
                      ProvinciaRemitoElectronico: {
                        IdProvinciaRemitoElectronico: 0,
                        Codigo: "",
                        Nombre: "",
                        Activo: false
                      },
                      TipoPadron: 0
                    },
                    BaseImponible: 0,
                    PorcentajeRetencion: 0,
                    ImporteMinimo: 0,
                    Cuenta: {
                      IdCuenta: 0,
                      Codigo: "",
                      Descripcion: "",
                      Capitulo: 0,
                      ColumnaBalance: 0,
                      Imputable: false,
                      Habilitada: false,
                      CentroCostos: false,
                      AjustablePorInflacion: false,
                      EsMonetaria: false,
                      Indice: 0,
                      CuentaPadre: null,
                      EsSubCuenta: false
                    },
                    Activo: false,
                    Pagos: false,
                    Cobros: false,
                    OrdenPagoTotalMinimo: 0,
                    PuntoVentaCertificadoRetencion: 0,
                    CodigoImpuesto: ""
                  },
                  AplicaEnNotasDebitoTotales: false,
                  AplicaEnNotasDebitoParciales: false,
                  AplicaEnNotasCreditoTotales: false,
                  AplicaEnNotasCreditoParciales: false,
                  Activo: false
                },
                RequiereAutorizacionRemitoCompra: false,
                OperadorCompra: {
                  IdOperadorCompra: 0,
                  Codigo: "",
                  Nombre: "",
                  Observaciones: "",
                  Usuario: {
                    IdUsuario: 0,
                    Implementacion: {
                      IdImplementacion: 0,
                      Nombre: "",
                      Dominio: "",
                      NombreBaseDatos: ""
                    },
                    UsuarioAcceso: "",
                    Contrasena: "",
                    Nombre: "",
                    NivelUsuario: {
                      IdNivelUsuario: 0,
                      Nombre: "",
                      Implementacion: {
                        IdImplementacion: 0,
                        Nombre: "",
                        Dominio: "",
                        NombreBaseDatos: ""
                      }
                    },
                    Email: "",
                    UrlCarpetaGoogleDrive: "",
                    FechaPrimerLoginUltimaVersion: "0001-01-01T00:00:00",
                    CantidadIntentosFallidosConsecutivos: 0,
                    Bloqueado: false
                  },
                  EsSupervisor: false,
                  CanalCompra: {
                    IdCanalCompra: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  Activo: false
                },
                PaisIdioma: {
                  IdPaisIdioma: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                PorcentajeExencionPercepcionIVA: 0,
                FechaDesdeExencionPercepcionIVA: "0001-01-01T00:00:00",
                FechaHastaExencionPercepcionIVA: "0001-01-01T00:00:00",
                CBU: "",
                ClienteRelacionadoProveedor: null,
                NoRequiereOrdenCompraObligatoria: false,
                Departamento: {
                  IdDepartamento: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Provincia: {
                    IdProvincia: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Pais: {
                      IdPais: 0,
                      Codigo: "",
                      Nombre: "",
                      Latitud: 0,
                      Longitud: 0,
                      Activo: false
                    },
                    Activo: false,
                    ProvinciaRemitoElectronico: {
                      IdProvinciaRemitoElectronico: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    },
                    TipoPadron: 0
                  },
                  Activo: false,
                  IdDepartamentoCensal: 0
                },
                ExcluirFacturacionGuias: false,
                TarifaServicio: {
                  IdTarifaServicio: 0,
                  Codigo: "",
                  Nombre: "",
                  Habilitado: false,
                  Moneda: {
                    IdMoneda: 0,
                    Codigo: "",
                    Descripcion: "",
                    Simbolo: "",
                    Cotizacion: 0,
                    MonedaFacturacionElectronica: {
                      IdMonedaFacturacionElectronica: 0,
                      Codigo: "",
                      Nombre: "",
                      Activo: false
                    }
                  }
                }
              },
              LocalidadEntrega: "",
              CodigoPostalEntrega: "",
              PaisEntrega: {
                IdPais: 0,
                Codigo: "",
                Nombre: "",
                Latitud: 0,
                Longitud: 0,
                Activo: false
              },
              ProvinciaEntrega: {
                IdProvincia: 0,
                Codigo: "",
                Nombre: "",
                Latitud: 0,
                Longitud: 0,
                Pais: {
                  IdPais: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Activo: false
                },
                Activo: false,
                ProvinciaRemitoElectronico: {
                  IdProvinciaRemitoElectronico: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                TipoPadron: 0
              },
              ZonaEntrega: {
                IdZona: 0,
                Codigo: "",
                Nombre: "",
                Activo: false,
                EntregaLunes: false,
                EntregaMartes: false,
                EntregaMiercoles: false,
                EntregaJueves: false,
                EntregaViernes: false,
                EntregaSabado: false,
                EntregaDomingo: false,
                DemoraEnHorasFechaEntrega: 0,
                CostoEntrega: 0
              },
              CalleEntrega: "",
              NumeroCalleEntrega: "",
              LocalEntrega: "",
              DepartamentoEntrega: {
                IdDepartamento: 0,
                Codigo: "",
                Nombre: "",
                Latitud: 0,
                Longitud: 0,
                Provincia: {
                  IdProvincia: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Activo: false,
                  ProvinciaRemitoElectronico: {
                    IdProvinciaRemitoElectronico: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  TipoPadron: 0
                },
                Activo: false,
                IdDepartamentoCensal: 0
              },
              CallePerpendicular1Entrega: "",
              CallePerpendicular2Entrega: "",
              PisoEntrega: "",
              Transporte: {
                IdTransporte: 0,
                Codigo: "",
                RazonSocial: "",
                Direccion: "",
                Localidad: "",
                CodigoPostal: "",
                Telefono: "",
                NumeroDocumento: "",
                TipoDocumento: {
                  IdTipoDocumento: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false
                },
                DireccionEntrega: "",
                Email: "",
                Activo: false,
                LocalidadEntrega: "",
                CodigoPostalEntrega: "",
                Pais: {
                  IdPais: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Activo: false
                },
                Provincia: {
                  IdProvincia: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Activo: false,
                  ProvinciaRemitoElectronico: {
                    IdProvinciaRemitoElectronico: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  TipoPadron: 0
                },
                PaisEntrega: {
                  IdPais: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Activo: false
                },
                ProvinciaEntrega: {
                  IdProvincia: 0,
                  Codigo: "",
                  Nombre: "",
                  Latitud: 0,
                  Longitud: 0,
                  Pais: {
                    IdPais: 0,
                    Codigo: "",
                    Nombre: "",
                    Latitud: 0,
                    Longitud: 0,
                    Activo: false
                  },
                  Activo: false,
                  ProvinciaRemitoElectronico: {
                    IdProvinciaRemitoElectronico: 0,
                    Codigo: "",
                    Nombre: "",
                    Activo: false
                  },
                  TipoPadron: 0
                },
                ZonaEntrega: {
                  IdZona: 0,
                  Codigo: "",
                  Nombre: "",
                  Activo: false,
                  EntregaLunes: false,
                  EntregaMartes: false,
                  EntregaMiercoles: false,
                  EntregaJueves: false,
                  EntregaViernes: false,
                  EntregaSabado: false,
                  EntregaDomingo: false,
                  DemoraEnHorasFechaEntrega: 0,
                  CostoEntrega: 0
                },
                Patente: "",
                PatenteAcoplado: ""
              },
              Recepcion: "",
              MensajeEntrega: "",
              LatitudEntrega: 0,
              LongitudEntrega: 0,
              DireccionEntrega: ""
            },
            /* ListaPrecio: {
              IdListaPrecio: 1,
              Codigo: null,
              Descripcion: null,
              Habilitado: false,
              FechaDesde: null,
              FechaHasta: null,
              PorcentajePrecioSugerido: 0,
              Moneda: null,
              ListaPrecioAlternativa: null
            } */
          }
    }
}