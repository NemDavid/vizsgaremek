import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'




import StoreDevtools from '../lib/demo-store-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="min-h-screen flex flex-col">
      {/* Globális fejléc minden oldalon */}
      

      {/* Oldalspecifikus tartalom */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Devtools */}
      <TanStackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          StoreDevtools,
          TanStackQueryDevtools,
        ]}
      />
    </div>
  ),
})

