class CustomerSchema{
    constructor(reqBody){
      this.body = reqBody;
    }
    //Customer schema
    customerSchema = () => {
    const body = this.body;
      const schema = {
              order_id: Number(body.order_id),
              woo_customer_id: Number(body.woo_customer_id) ,
              cuit: String(body.cuit),
              codigo: String(body.codigo),
              billing: {
                  first_name: String(body.billing.first_name),
                  last_name: String(body.billing.last_name),
                  company_name: String(body.billing.company_name),
                  email: String(body.billing.email),
                  phone: String(body.billing.phone),
                  address: String(body.billing.address),
                  address_2: String(body.billing.address_2),
                  city: String(body.billing.city),
                  state: String(body.billing.state),
                  postcode: String(body.billing.postcode),
                  country: String(body.billing.country),
                  Zona: String(body.billing.Zona),
              },
              shipping: {
                  first_name: String(body.shipping.first_name),
                  last_name: String(body.shipping.last_name),
                  company_name: String(body.shipping.company_name),
                  email: String(body.shipping.email),
                  phone: String(body.shipping.phone),
                  address: String(body.shipping.address),
                  address_2: String(body.shipping.address_2),
                  city: String(body.shipping.city),
                  state: String(body.shipping.state),
                  postcode: String(body.shipping.postcode),
                  country: String(body.shipping.country),
              },
              b2b_king: {
                  b2b_group: String(body.b2b_king.b2b_group),
                  b2b_group_name: String(body.b2b_king.b2b_group_name),
                  b2b_group_discount: String(body.b2b_king.b2b_group_discount),
              }
          }
          
      return schema;
    } 
    centumCustomerSchema = (body) => {
      const fecha = new Date();
      const formattedDate = fecha.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
      //const metodosDePago = {transferencia: 6090, mercadoPAgo: 11365}
      //const metodoPago = body.method === "mercadoPago" ? metodosDePago.mercadoPAgo : metodosDePago.transferencia; 
      return {
          IdCliente: null,
          woo_customer_id: body.woo_customer_id,
          Codigo: body.codigo ?? "",
          RazonSocial: body.billing.company_name === "" ?  body.billing.first_name + " " + body.billing.last_name : body.billing.company_name,
          CUIT: body.cuit,
          //billing
          Direccion: body.billing.address + " " + body.billing.address_2,
          Localidad: body.billing.city,
          CodigoPostal: body.billing.postcode,
          Provincia: {
            IdProvincia: 6095
          },
          Pais: {
            IdPais: 4657
          },
          Zona: {
            IdZona: 7924
          },
          Latitud: null,
          Longitud: null,
          //shipping
          DireccionEntrega: body.shipping.address + " " + body.shipping.address_2 ?? null,
          CalleEntrega: body.shipping.address + " " + body.shipping.address_2 ?? null,
          NumeroCalleEntrega: null,
          LocalEntrega: body.shipping.company_name ?? null,
          CallePerpendicular1Entrega: null,
          CallePerpendicular2Entrega: null,
          LocalidadEntrega: body.shipping.city ?? null,
          CodigoPostalEntrega: body.shipping.postcode ?? null,
          DepartamentoEntrega: {
            IdDepartamento: 7015
          },
          ProvinciaEntrega: {
            IdProvincia: 6095
          },
          PaisEntrega: {
            IdPais: 4657
          },
          ZonaEntrega: {
            IdZona: 7924
          }, 
  
          LatitudEntrega: null,
          LongitudEntrega: null,
          Telefono: body.billing.phone,
          TelefonoAlternativo: null,
          Fax: null,
          Interno: null,
          Email: body.billing.email,
          ObservacionesCliente: null,
          CondicionIVA: {
            IdCondicionIVA: 1895 //Responsable Inscripto
          },
          CondicionVenta: {
            IdCondicionVenta: 21
          },
          Vendedor: {
            IdVendedor: 10
          },
          Transporte: {
            IdTransporte: 19
          },
          Bonificacion: {
            IdBonificacion: 6235
          },
          LimiteCredito: {
            IdLimiteCredito: 46002
          },
          ClaseCliente: {
            IdClaseCliente: 11419
          },
          ConceptoVenta: {
            IdConcepto: 107
          },
          FrecuenciaCliente: {
            IdFrecuenciaCliente: 6891
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
            IdCanalCliente: 6899
          },
          CadenaCliente: {
            IdCadenaCliente: 6920
          },
          UbicacionCliente: {
            IdUbicacionCliente: 6942
          },
          EdadesPromedioConsumidoresCliente: {
            IdEdadesPromedioConsumidoresCliente: 6951
          },
          GeneroPromedioConsumidoresCliente: {
            IdGeneroPromedioConsumidoresCliente: 6964
          },
          DiasAtencionCliente: {
            IdDiasAtencionCliente: 6969
          },
          HorarioAtencionCliente: {
            IdHorarioAtencionCliente: 6970
          },
          CigarreraCliente: {
            IdCigarreraCliente: 6972
          },
          ListaPrecio: {
            IdListaPrecio: 9
          },
          DiasMorosidad: 30,
          DiasIncobrables: 180,
          EsClienteMassalin: null,
          TipoIncoterm: null,
          ImporteMinimoPedido: null,
          ContactoEnvioComprobanteEmpresa: [],
          Activo: true,
          FechaAltaCliente: formattedDate, //ex: 2025-03-14T00
          CondicionIIBB: {
            IdCondicionIIBB: 6051
          },
          NumeroIIBB: body.cuit + "000"  /*null in response but not in schema*/
        }
      }
    }
  export {CustomerSchema};