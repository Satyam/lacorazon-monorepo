declare global {
  type ID = string | number;
  type VALUE = string | number | boolean | Date;
  type AnyRow = Record<string, VALUE>;

  type ArrayElementType<T> = T extends (infer U)[]
    ? U
    : T extends (...args: unknown[]) => infer U
    ? U
    : T extends Promise<infer U>
    ? U
    : T;

  // types related to data sets
  type Fila = Consignacion | Distribuidor | Salida | User | Venta;

  type Consignacion = {
    id: ID;
    fecha: Date;
    idDistribuidor?: ID;
    idVendedor?: ID;
    entregados?: number;
    porcentaje?: number;
    vendidos?: number;
    devueltos?: number;
    cobrado?: number;
    iva?: boolean;
    comentarios?: string;
  };

  type Distribuidor = {
    id: ID;
    nombre: string;
    localidad?: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };

  type Salida = {
    id: ID;
    fecha: Date;
    concepto?: string;
    importe?: number;
  };

  type User = {
    id: ID;
    nombre: string;
    email?: string;
    password?: string;
  };

  type Vendedor = {
    id: ID;
    nombre: string;
    email?: string;
  };

  type Venta = {
    id: ID;
    concepto?: string;
    fecha: Date;
    idVendedor?: ID;
    cantidad?: number;
    precioUnitario?: number;
    iva?: boolean;
  };

  type VentaYVendedor = Venta & { vendedor?: string };
}

export {};
