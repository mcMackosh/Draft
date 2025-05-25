FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Draft/Draft.csproj", "Draft/"]
RUN dotnet restore "./Draft/Draft.csproj"
COPY . .
WORKDIR "/src/Draft"
RUN dotnet build "./Draft.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./Draft.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Draft.dll"]