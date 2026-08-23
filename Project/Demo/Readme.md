step 0: create new project

step 1: in appsettings.json add connection string -> default connection

step 2: add this 2 package
    dotnet add package Microsoft.EntityFrameworkCore.SqlServer
    dotnet add package Microsoft.EntityFrameworkCore.Tools

step 3: create folder Controllers, Models, DTO, Validators, Data

step 4: create models

step 5: create app db context

step 6: if one to one relationship exists then add the field with public Model Model = null!

step 7: if one to many relationship exists then add ICollection to model which is one

step 8: in program.cs add builder.service.adddbcontext usesqlserver

step 9: create the first migration
    dotnet ef migrations add InitialCreate # 
    dotnet ef database update

step 10: create DTO and common api response

step 11: install fluent validation packages
    dotnet add package FluentValidation
    dotnet add package FluentValidation.AspNetCore

step 12: add fluent validation service in program.cs

step 13: 