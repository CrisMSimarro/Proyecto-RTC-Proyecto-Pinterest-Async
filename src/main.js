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
const state = {
  query: 'nature',
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
const { header } = Header({
  initialQuery: state.query,
  onSearch: (newQuery) => {
    state.query = newQuery
    state.page = 1
    state.totalPages = 1
    grid.innerHTML = ''
    loadPhotos(true)
  }
})

/*LAYOUT*/
const container = document.createElement('div')
container.className = 'container'

const main = document.createElement('main')
main.className = 'main'

const grid = MasonryGrid()

const footer = document.createElement('div')
footer.className = 'footerbar'

const loader = Loader()
footer.appendChild(loader)

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
      grid.appendChild(EmptyState(state.query))
      return
    }

    const fragment = document.createDocumentFragment()

    data.results.forEach((photo) => {
      fragment.appendChild(PinCard(photo))
    })

    grid.appendChild(fragment)
  } catch (error) {
    console.error('❌ Error cargando fotos:', error)

    grid.innerHTML = `
      <div style="padding:24px;color:red;">
        Error cargando imágenes:<br/>
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
