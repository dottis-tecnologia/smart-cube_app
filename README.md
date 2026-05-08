# Cube4Meters - Smart Cube QR Code

Aplicativo móvel para coleta de leituras de medidores de energia através de QR Code, desenvolvido pela Dottis Tecnologia.

## 📱 Descrição

O Cube4Meters é uma solução mobile para gestão de leituras de consumo energético, permitindo:

- Leitura de medidores via QR Code
- Armazenamento local offline
- Sincronização automática com servidor
- Gestão de dados de consumo
- Suporte multi-idiomas

## 🛠 Stack Tecnológico

- **Framework**: React Native + Expo SDK 49
- **Linguagem**: TypeScript 5
- **UI**: NativeBase 3
- **Navegação**: React Navigation
- **Estado Local**: Expo SQLite
- **Comunicação**: tRPC Client + SuperJSON
- **Internacionalização**: i18next
- **Autenticação**: JWT + Expo Secure Store

## 📋 Pré-requisitos

- Node.js 18+
- Yarn 1.22+
- Expo CLI
- Conta Expo configurada

## 🚀 Instalação e Desenvolvimento

1. Clone o repositório:
```bash
git clone <repository-url>
cd smart-cube-qrcode/smart-cube_app
```

2. Instale dependências:
```bash
yarn install
```

3. Configure variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. Inicie o desenvolvimento:
```bash
# Para desenvolvimento local
yarn start

# Para Android
yarn android

# Para iOS
yarn ios
```

## 📱 Build e Deploy

### Desenvolvimento
```bash
# Build de desenvolvimento
eas build --profile development
```

### Staging
```bash
# Build de staging
eas build --profile staging
```

### Produção
```bash
# Build de produção para Android
eas build --profile production --platform android

# Build de produção para iOS
eas build --profile production --platform ios
```

## 🔧 Configurações

### Variáveis de Ambiente

- `EXPO_PUBLIC_API_URL`: URL da API backend
- `EXPO_PUBLIC_STAGING`: Flag para ambiente de staging

### Perfis de Build

- **development**: Client de desenvolvimento, APK
- **preview**: Build interno para testes
- **staging**: Ambiente de homologação
- **production**: Build final para lojas

## 📁 Estrutura do Projeto

```
smart-cube_app/
├── components/          # Componentes React Native
│   ├── CreateReading/ # Componentes de leitura
│   ├── shared/        # Componentes compartilhados
│   └── util/          # Utilitários de UI
├── screens/           # Telas do aplicativo
│   ├── NoAuth/        # Telas sem autenticação
│   └── Tabs/          # Telas com navegação por abas
├── hooks/             # Hooks customizados
├── util/              # Utilitários gerais
│   ├── sync/          # Lógica de sincronização
│   └── db.ts          # Configuração SQLite
├── locales/           # Arquivos de tradução
├── assets/            # Imagens e ícones
└── config.ts          # Configurações gerais
```

## 🔐 Segurança

- Tokens JWT armazenados em SecureStore
- Criptografia de dados sensíveis
- Validação de inputs no cliente e servidor
- Política de privacidade compliance

## 📊 Fluxo Principal

1. **Login**: Autenticação via email/senha
2. **Home**: Dashboard com informações do usuário
3. **Scan QR**: Leitura de QR Code dos medidores
4. **Create Reading**: Registro de leitura com foto
5. **Sync**: Sincronização automática de dados

## 🌐 Internacionalização

O aplicativo suporta múltiplos idiomas através do i18next:
- Português (Brasil) - padrão
- Inglês
- Espanhol

## 📱 Permissões

### Android
- `CAMERA`: Acesso à câmera para QR Code
- `RECORD_AUDIO`: Gravação de áudio (futuro)

### iOS
- Acesso à câmera
- Acesso ao armazenamento local

## 🧪 Testes

```bash
# Para executar testes (quando implementados)
yarn test
```

## 📝 Política de Privacidade

Nossa política de privacidade está disponível em:
[privacy-policy.html](./privacy-policy.html)

## 📋 Termos de Uso

Os termos de uso do aplicativo estão disponíveis em:
[terms-of-service.html](./terms-of-service.html)

## 🚀 Publicação

### Google Play Store
- Package: `com.dottis.smartcube`
- Data Safety configurado
- Política de privacidade disponível

### Apple App Store
- Configurações iOS otimizadas
- Metadados completos
- Screenshots preparados

## 📞 Suporte

- **Email**: support@dottis.com.br
- **Empresa**: Dottis Tecnologia
- **Versão**: 1.2.0

## 📄 Licença

Todos os direitos reservados © 2026 Dottis Tecnologia

---

## 🐛 Troubleshooting

### Problemas Comuns

1. **Metro bundler falhou**: Limpe cache com `expo start -c`
2. **Build falhou**: Verifique variáveis de ambiente
3. **QR Code não lê**: Verifique permissões de câmera

### Comandos Úteis

```bash
# Limpar cache
expo start -c

# Verificar versão Expo
expo --version

# Listar dispositivos
expo install --fix

# Limpar node_modules
rm -rf node_modules && yarn install
```

---

Para mais informações, entre em contato com a equipe de desenvolvimento.