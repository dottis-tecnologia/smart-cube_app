# Guia de Migração - Redesign Smart Cube

## Resumo da Fase 1

A Fase 1 do redesign foi implementada com sucesso. Esta fase inclui:

1. **Atualização do Expo SDK**: 49 → 52
2. **Migração de NativeBase para React Native Paper** (Material Design 3)
3. **Criação do Design System** com tokens de cores, tipografia e espaçamento
4. **Novo ThemeProvider** integrando Paper + Bottom Sheet + Gesture Handler

---

## Próximos Passos

### 1. Instalar Dependências

```bash
cd smart-cube_app
yarn install
```

### 2. Atualizar Expo (opcional mas recomendado)

```bash
expo install expo-camera expo-sqlite expo-secure-store
```

### 3. Verificar Funcionamento

```bash
yarn start
```

---

## Estrutura do Novo Design System

```
theme/
├── index.ts          # Exportações principais
├── colors.ts         # Paleta de cores (Material You)
├── typography.ts     # Tipografia MD3
├── spacing.ts        # Espaçamento 8px grid
└── paperTheme.ts     # Tema React Native Paper

components/
├── ThemeProvider.tsx # Provider principal
└── ui/               # Componentes base (próxima fase)
    ├── Card.tsx
    ├── Button.tsx
    ├── Input.tsx
    └── ...
```

---

## Uso dos Tokens

### Cores
```typescript
import { colors } from '../theme';

// Uso direto
backgroundColor: colors.primary
backgroundColor: colors.surface
backgroundColor: colors.success
```

### Tipografia
```typescript
import { typography } from '../theme';

// Uso no StyleSheet
const styles = StyleSheet.create({
  title: typography.titleLarge,
  body: typography.bodyMedium,
});
```

### Espaçamento
```typescript
import { spacing, borderRadius, elevation } from '../theme';

// Uso
padding: spacing.md,      // 12px
borderRadius: borderRadius.lg,  // 12px
...elevation.level2,       // Sombra
```

---

## Uso do React Native Paper

```typescript
import { Button, Card, Text, useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge">Título</Text>
        <Text variant="bodyMedium">Conteúdo</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Ação</Button>
      </Card.Actions>
    </Card>
  );
}
```

---

## Diferenças NativeBase → Paper

| NativeBase | Paper |
|------------|-------|
| `Box` | `View` ou `Surface` |
| `Button` | `Button` (mode: text/flat/outlined/contained) |
| `Input` | `TextInput` (mode: flat/outlined) |
| `Text` | `Text` (variant: display/headline/title/body/label) |
| `VStack/HStack` | `View` com `flexDirection` |
| `Center` | `View` com `justifyContent/alignItems: 'center'` |
| `Spinner` | `ActivityIndicator` |
| `Icon` | `IconButton` ou `Avatar.Icon` |
| `Badge` | `Badge` |

---

## Próxima Fase (Fase 2)

A Fase 2 consiste em criar componentes UI base modernos:

- `Card` - Cards com elevação e animações
- `Button` - Variações primary/secondary/outline
- `Input` - TextInput estilizado com ícones
- `AppHeader` - Header navegação
- `FAB` - Floating Action Button
- `Badge` - Status indicators
- `EmptyState` - Estados vazios
- `Skeleton` - Loading states

---

## Notas Importantes

1. **NativeBase ainda está instalado** - Remover apenas após migrar todas as telas
2. **Os erros de lint são esperados** - Desaparecem após `yarn install`
3. **Testar em ambas plataformas** - iOS e Android
4. **Manter compatibilidade** - Migrar uma tela por vez

---

## Comandos Úteis

```bash
# Instalar dependências
yarn install

# Limpar cache
expo start -c

# Verificar types
npx tsc --noEmit
```
