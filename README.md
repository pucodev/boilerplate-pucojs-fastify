# 🧭 Boilerplate para proyectos Nodejs

Código boilerplate para construir proyectos API basados en nodejs con fastify y postgres sql, esta es una estructura base que se puede usar como inicio

## Estructura

```
src\
 |--controllers\    # Controladores que se conectan a un route
 |--models\         # Modelos
 |--routes\         # Rutas
 |--services\       # Servicios que se conectan a la base de datos
 |--index.js        # Aplicación
```

## Endpoints

### Insertar un usuario

- Method: `POST`
- Endpoint: `/api/v1/users`
- Params:

```
{
  "firstname": "Nombres",
  "lastname": "Apellidos",
  "email": "Email"
}
```

### Actualizar un usuario

- Method: `PATCH`
- Endpoint: `/api/v1/users/{id}`
- Params:

```
{
  "firstname": "Nombres",
  "lastname": "Apellidos",
  "email": "Email"
}
```

### Obtener usuarios

Mediante este endpoint puedes obtener usuarios devolviendo una estructura variable además de la posibilidad de poder realizar filtros.

#### fields

Para configurar los campos a devolver de la consulta se debe enviar en el query la variable `fields` con los campos separados por comas

Ejemplo:

`?fields=firstname,lastname,id` => Esto devolverá solo el `firstnam`, `lastname` e `id`

#### filters

Para configurar el filtro a realizar se debe enviar en el query el campo y el valor que se quiere filtrar, para la version actual solo hace filtros con el comparador `=`

Ejemplo:
`?id=2&firstname=Jon` => Esto filtrará los usuarios que tengan como `id = 2` y `firstname = Jon`

#### Ejemplo

- Method: `GET`
- Endpoint: `/api/v1/users/?fields=firstname,id&firstname=Jon&lastname=Doe`
