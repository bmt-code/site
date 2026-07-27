# Mídia pendente — Zenith e Guide

As páginas `/zenith` e `/guide` já estão prontas e funcionando. Falta só colocar
os arquivos de mídia nas pastas abaixo, **com exatamente estes nomes**. Enquanto
não estiverem lá, o navegador mostra o `alt` no lugar da imagem e o vídeo fica em
branco — nada quebra.

Todo caminho é relativo a `site/`.

---

## Imagens de produto

Fundo transparente, PNG (ou WebP). São as fotos "herói" do produto.

| Arquivo | Onde aparece | Tamanho sugerido |
|---|---|---|
| `img/zenith-produto.png` | Home (billboard Zenith), topo da página Zenith, billboard na página Guide, JSON-LD | ~1200 × 1200 |
| `img/zenith-lite-produto.png` | Aba **Lite** do seletor de tiers | ~1000 × 1000 |
| `img/zenith-pro-produto.png` | Aba **Pro** do seletor de tiers (mostre os óculos 3D aqui) | ~1000 × 1000 |
| `img/guide-produto.png` | Home (billboard Guide), topo da página Guide, teaser na página Zenith | ~1400 × 1000 |

> `img/zenith-produto.png` já era referenciado pelo site antigo e **nunca existiu no
> disco** — é a peça mais importante da lista, porque aparece em três páginas.

## Imagem de compartilhamento (redes sociais / WhatsApp)

| Arquivo | Onde aparece | Tamanho |
|---|---|---|
| `img/og-guide.jpg` | Preview do link `/guide` | 1200 × 630 (obrigatório) |

`img/og-zenith.jpg` já existe — vale conferir se o texto dele ainda combina com o
posicionamento novo (dois tiers, não só o 3D).

---

## Vídeos + posters

Cada vídeo tem um **poster**: a imagem estática que aparece antes do vídeo tocar.
No celular o vídeo dá play sozinho ao entrar na tela; no desktop, ao passar o mouse.

**Formato dos vídeos:** MP4 (H.264), **sem áudio**, em loop de 8 a 15 segundos,
até ~4 MB cada. Acima disso a página fica lenta no 4G da clínica.
**Posters:** PNG ou JPG, 1280 × 720.

### Página Zenith — recursos dos dois tiers (`#funcionalidades`)

| Vídeo | Poster | O que mostrar |
|---|---|---|
| `videos/zenith-feature-1.mp4` | `img/feature-zenith-1.png` | Gravando e tirando foto durante um procedimento |
| `videos/zenith-feature-2.mp4` | `img/feature-zenith-2.png` | Alguém navegando na galeria pela tela sensível ao toque |
| `videos/zenith-feature-3.mp4` | `img/feature-zenith-3.png` | A imagem aparecendo em outra tela da clínica, sem cabo |
| `videos/zenith-feature-4.mp4` | `img/feature-zenith-4.png` | A captura subindo e aparecendo no Guide |

### Página Zenith — exclusivo do Pro (`#pro-exclusivo`)

Só aparece quando o visitante clica na aba **Zenith Pro**.

| Vídeo | Poster | O que mostrar |
|---|---|---|
| `videos/zenith-pro-1.mp4` | `img/feature-zenith-pro-1.png` | A visão 3D nos óculos / modo exoscópio |
| `videos/zenith-pro-2.mp4` | `img/feature-zenith-pro-2.png` | Cirurgião operando longe do ocular, postura ereta |

### Página Guide (`#funcionalidades`)

Pode ser captura de tela da plataforma rodando — não precisa ser filmagem.

| Vídeo | Poster | O que mostrar |
|---|---|---|
| `videos/guide-1.mp4` | `img/feature-guide-1.png` | Lista de pacientes / busca por um caso |
| `videos/guide-2.mp4` | `img/feature-guide-2.png` | Prontuário com histórico ao lado das imagens |
| `videos/guide-3.mp4` | `img/feature-guide-3.png` | Ferramentas de planejamento: medição, ângulo, contorno, segmentação |
| `videos/guide-4.mp4` | `img/feature-guide-4.png` | A plataforma aberta no celular ou tablet |
| `videos/guide-5.mp4` | `img/feature-guide-5.png` | Um caso sendo revisto / usado para ensino |

---

### Vídeos de fundo do Hero (Zenith & Guide)

As páginas Zenith e Guide agora possuem suporte completo a vídeo de fundo igual ao Orion e à Home. Por padrão, elas utilizam `videos/video.mp4`. Se quiser utilizar vídeos específicos de produto nos heroes:

| Vídeo | Onde aparece | O que mostrar |
|---|---|---|
| `videos/zenith-hero.mp4` | Hero da página `/zenith` | Captura de imagem de microscópio, transmissão e visão 3D |
| `videos/guide-hero.mp4` | Hero da página `/guide` | Interface e nuvem da plataforma clínica Guide |

## Como conferir depois de colocar os arquivos

Rode dentro de `site/`:

```
python3 -m http.server 8000
```

e abra `http://localhost:8000/zenith.html` e `http://localhost:8000/guide.html`.
Se alguma imagem aparecer como texto quebrado, o nome do arquivo está diferente do
que está na tabela acima.
