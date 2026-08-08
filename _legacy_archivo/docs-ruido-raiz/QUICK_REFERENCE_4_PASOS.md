## ⚡ REFERENCIA RÁPIDA - 4 PASOS

### 📊 ESTADO ACTUAL
```
✅ 2 Completados  |  ⏳ 2 Pendientes  |  ⏱️ 5-10 min restantes
```

---

## 🔴 PASO 1: Crear marketplace_items

**Archivo:** `SQL_MARKETPLACE_SETUP.sql`

**En 30 segundos:**
```
1. https://app.supabase.com
2. SQL Editor
3. Copy → SQL_MARKETPLACE_SETUP.sql
4. Paste → Run
5. ✅ Done
```

---

## 🔴 PASO 2: RLS Policies

**Archivo:** `SQL_RLS_POLICIES.sql`

**En 30 segundos:**
```
1. SQL Editor (new query)
2. Copy → SQL_RLS_POLICIES.sql
3. Paste → Run
4. Check: Authentication > Policies (20 items)
5. ✅ Done
```

---

## ✅ PASO 3: HomePage Filtrado

**Archivo:** `src/pages/HomePage.jsx` ✏️ MODIFICADO

**Ya implementado:**
- ✅ cargarFollowers() function
- ✅ 2 sections: Seguidos + Sugerencias
- ✅ Gold vs Orange styling
- ✅ Dynamic counters

**Nada que hacer** ← Just works!

---

## ✅ PASO 4: Modal Comentarios

**Archivo:** `src/components/CommentsModal.jsx` 🆕 NUEVO

**Ya implementado:**
- ✅ Full modal popup
- ✅ Comments + Nested replies
- ✅ Add/Delete/Reply buttons
- ✅ Realtime updates
- ✅ Press Enter to send

**Nada que hacer** ← Just works!

---

## 📋 VALIDATION

**After SQL execution:**
```sql
-- En Supabase SQL Editor:
SELECT * FROM marketplace_items LIMIT 1;
SELECT * FROM user_stats LIMIT 1;
```

**In browser (npm run dev):**
- [ ] HomePage compila sin errores
- [ ] 2 post sections visible
- [ ] Click 💬 opens modal
- [ ] Can add comments
- [ ] Realtime updates

---

## 📁 FILES INVOLVED

| File | Status | Type |
|------|--------|------|
| SQL_MARKETPLACE_SETUP.sql | 🔴 Pending | SQL |
| SQL_RLS_POLICIES.sql | 🔴 Pending | SQL |
| src/pages/HomePage.jsx | ✅ Done | React |
| src/components/CommentsModal.jsx | ✅ Done | React |
| GUIA_IMPLEMENTACION_4_PASOS.md | 📚 Reference | Docs |
| GUIA_VISUAL_PASO_A_PASO.md | 📚 Reference | Docs |

---

## ⏱️ TIMELINE

```
5 min → SQL marketplace table
5 min → SQL RLS policies
0 min → HomePage (done)
0 min → Modal (done)
```

**Total: ~10 minutes**

---

## 🆘 QUICK FIX

| Error | Solution |
|-------|----------|
| "posts table not found" | Run futpro_schema_complete.sql first |
| "RLS policy fails" | Check users table has: id, email, full_name, avatar_url |
| "CommentsModal not opening" | Verify import in HomePage.jsx line 3 |
| "No comments in modal" | Check comments table has parent_id column |
| "Marketplace fallback" | After creating marketplace_items, will load from DB |

---

## 🚀 NEXT

1. Copy SQL to Supabase
2. Run queries
3. Test in app
4. Done! 🎉

---

**Ready to implement?** Open: `GUIA_VISUAL_PASO_A_PASO.md` for step-by-step instructions
