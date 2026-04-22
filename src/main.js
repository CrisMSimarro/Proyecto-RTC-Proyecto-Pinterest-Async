import { searchPhotos } from './api.js'
import {
  Header,
  MasonryGrid,
  PinCard,
  Loader,
  EmptyState
} from './components.js'

console.log('✅ main.js cargado')

/*STATE*/
const INITIAL_QUERY = 'nature'

const state = {
  query: INITIAL_QUERY,
  page: 1,
  perPage: 20,
  totalPages: 1,
  loading: false
}

/*ROOT*/
const app = document.querySelector('#app')

if (!app) {
  throw new Error('No existe el elemento #app en index.html')
}

/* HEADER*/
const { header, input } = Header({
  initialQuery: '',
  onSearch: (newQuery) => {
    state.query = newQuery
    state.page = 1
    state.totalPages = 1
    grid.innerHTML = ''
    loadPhotos(true)
    input.value = ''
  },
  onReset: () => {
    state.query = INITIAL_QUERY
    state.page = 1
    state.totalPages = 1
    grid.innerHTML = ''
    emptyStateContainer.innerHTML = ''
    loadPhotos(true)
    input.value = ''
  }
})
/*LAYOUT*/
const container = document.createElement('div')
container.className = 'container'

const main = document.createElement('main')
main.className = 'main'

const grid = MasonryGrid()
const emptyStateContainer = document.createElement('div')
emptyStateContainer.className = 'empty-state-container'

const footer = document.createElement('div')
footer.className = 'footerbar'

const loader = Loader()
footer.appendChild(loader)

main.appendChild(emptyStateContainer)
main.appendChild(grid)
main.appendChild(footer)
container.appendChild(main)

app.appendChild(header)
app.appendChild(container)

/*INFINITE SCROLL */
const sentinel = document.createElement('div')
sentinel.style.height = '1px'
footer.appendChild(sentinel)

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore()
    }
  },
  { rootMargin: '600px' }
)

observer.observe(sentinel)

/*DATA*/
async function loadPhotos(reset = false) {
  if (state.loading) return
  if (!reset && state.page > state.totalPages) return

  state.loading = true
  loader.style.display = 'flex'

  try {
    console.log(`🔍 Buscando "${state.query}" | página ${state.page}`)

    const data = await searchPhotos(state.query, state.page, state.perPage)

    console.log('📦 Respuesta Unsplash:', data)

    state.totalPages = data.total_pages || 1

  if (reset && data.results.length === 0) {
  emptyStateContainer.innerHTML = ''
  emptyStateContainer.appendChild(EmptyState(state.query))
  return
}
    if (reset) {
  emptyStateContainer.innerHTML = ''
}
    const fragment = document.createDocumentFragment()

    data.results.forEach((photo) => {
      fragment.appendChild(PinCard(photo))
    })

    grid.appendChild(fragment)
  } catch (error) {
    console.error('❌ Error cargando fotos:', error)

emptyStateContainer.innerHTML = `
  <div class="empty">
    <strong>Error cargando imágenes</strong><br/>
    ${error.message}
  </div>
`
  } finally {
    state.loading = false
    loader.style.display = state.page < state.totalPages ? 'flex' : 'none'
  }
}

function loadMore() {
  if (state.loading) return
  if (state.page >= state.totalPages) return

  state.page += 1
  loadPhotos()
}

/* INIT*/
loadPhotos(true)
