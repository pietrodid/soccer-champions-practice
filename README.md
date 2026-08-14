# Guía rápida para correr el proyecto (Soccer Champions)

Hola! Dejo esta guía paso a paso por si sos un tercero o evaluador que recibe este proyecto y quiere levantarlo desde cero en su máquina local. Intenté dejar las instrucciones lo más claras y directas posible.

---

## 1. Requisitos previos (Instalar primero)

Antes de empezar, vas a necesitar tener instalado lo siguiente:

| **.NET 8 SDK** | https://dotnet.microsoft.com/download | 8.x |
| **Node.js** | https://nodejs.org | 18 o superior (v20 recomendada) |
| **SQL Server** | https://www.microsoft.com/sql-server | Express o Developer Edition |

> **Nota:** No hace falta instalar Angular CLI de forma global (`npm install -g @angular/cli`), ya que el proyecto incluye Angular como dependencia local.

Para comprobar que todo se instaló bien, podés abrir una terminal y correr:

```bash
dotnet --version      
node --version        
npm --version         

2. Crear la base de datos
Abre SQL Server Management Studio (SSMS).
Conectate a tu servidor local.
Asegúrate de tener activada la Autenticación Mixta (SQL Server and Windows Authentication mode) en las propiedades del servidor.
Abre el archivo Database/database.sql y ejecutalo (F5).
Esto crea la base de datos SoccerDB con sus tablas, restricciones y datos iniciales.

3. Levantar el Backend (API)
```
cd Backend
dotnet restore
dotnet run
```
La API queda en http://localhost:5000
Swagger (para probar endpoints): http://localhost:5000/swagger
Importante: si tu SQL Server no se llama `localhost`, editá el archivo
`Backend/appsettings.json`:
```
"DefaultConnection": "Server=localhost;Database=SoccerDB;Trusted_Connection=True;TrustServerCertificate=True;"

4. Levantar el Frontend (Angular)
```
cd Frontend/soccer-app
npm install        # instala todas las dependencias (tarda un par de minutos)
npm start
```
La app queda en http://localhost:4200
> Si `npm start` fallara por el comando `ng`, usá `npx ng serve`.

Urls Finales:

Aplicación Angular: http://localhost:4200
Swagger de la API: http://localhost:5000/swagger