# Architecture

```text
                 ┌──────────────────┐
                 │   Vue 3 Frontend │
                 └────────┬─────────┘
                          │ REST/JSON
                 ┌────────▼─────────┐
                 │ Express.js API   │
                 └────────┬─────────┘
                          │ SQL
                 ┌────────▼─────────┐
                 │   PostgreSQL     │
                 └────────┬─────────┘
                          │
                ┌─────────▼──────────┐
                │ Power BI / Python  │
                │ Analytics & Reports│
                └────────────────────┘
```

## Future Azure deployment

- Azure App Service → Express API
- Azure Static Web Apps → Vue frontend
- Azure Database for PostgreSQL → database
- Azure Monitor → application monitoring
- GitHub Actions → CI/CD
