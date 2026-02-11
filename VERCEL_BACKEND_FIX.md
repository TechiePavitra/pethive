# PetHive Backend Connection Fix for Vercel

## Issues Fixed

1. **Hardcoded localhost URLs** - Removed hardcoded `http://localhost:3001` from `AdminLayout.jsx` and `ChatWidget.jsx`
2. **API client now uses centralized configuration** - All components use the `api.js` helper which defaults to `/api`
3. **Updated vercel.json** - Added environment variables configuration placeholders

