# 📋 Tarefas Manuais para Publicação nas Lojas

## 🔧 **Tarefas que VOCÊ precisa executar:**

### 1. **Builds de Produção** ⚡
```bash
# Build Android (AAB para Google Play)
eas build --profile production --platform android

# Build iOS (IPA para Apple Store)
eas build --profile production --platform ios
```

### 2. **Capturar Screenshots** 📱
- **Mínimo 8 screenshots por plataforma**
- **Dimensões:**
  - Google Play: 1080x1920px (ou 3840x2160px tablets)
  - Apple Store: 1242x2688px (iPhone X/11/12)
- **Telas recomendadas:**
  1. Login
  2. Dashboard/Home
  3. Scanner QR Code
  4. Formulário leitura
  5. Lista leituras
  6. Menu navegação
  7. Perfil/Configurações
  8. Sincronização

### 3. **Configurar Política de Privacidade Online** 🌐
- Hospedar `privacy-policy.html` em um domínio
- Atualizar URL no Google Play Console
- Atualizar URL no Apple App Store Connect

### 4. **Google Play Console** 🎮
- Preencher **Data Safety** (use `data-safety-config.md`)
- Upload do **AAB** gerado
- Adicionar **screenshots**
- Configurar **descrições** (use `store-assets/README.md`)
- Definir **categoria**: "Utilitários" ou "Produtividade"
- Configurar **preço**: Gratuito
- Adicionar **política de privacidade**

### 5. **Apple App Store Connect** 🍎
- Upload do **IPA** gerado
- Adicionar **screenshots**
- Configurar **descrições**
- Definir **categoria**: "Utilitários"
- Adicionar **política de privacidade**
- Preencher **App Review Information**

### 6. **Testes Finais** ✅
- Testar build em dispositivos reais
- Verificar fluxo completo: Login → Scan → Leitura → Sync
- Testar offline/online
- Verificar permissões de câmera

### 7. **Documentação Final** 📚
- Atualizar versão no `package.json` se necessário
- Commit final com todas mudanças
- Tag no Git: `v1.2.0`

---

## ⚠️ **Pontos Críticos:**

1. **URL da Política de Privacidade**: ESSENCIAL para aprovação
2. **Data Safety**: Google Play rejeita se incompleto
3. **Screenshots**: Mínimo obrigatório em ambas lojas
4. **Builds**: Use AAB para Google Play, IPA para Apple

---

## 📞 **Suporte se Precisar:**
- **Email**: support@dottis.com.br
- **Documentação**: README.md atualizado
- **Configurações**: Todos arquivos gerados

---

## ✅ **Status Atual:**
- ✅ Política de Privacidade criada
- ✅ Termos de Uso criados  
- ✅ README.md completo
- ✅ eas.json configurado
- ✅ Console logs removidos
- ✅ Data Safety configurado
- ✅ Assets preparados
- ⏳ **Seu turno: Builds e uploads**

**Tempo estimado:** 2-3 horas para completar tudo

---

**Boa sorte com a publicação!** 🚀
