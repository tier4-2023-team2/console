import DenseAppBar from './components/appbar';
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Autoware Admin Console',
  description: 'Admin console for Autoware',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <DenseAppBar appbar_height={APPBAR_HEIGHT} ws_directory={ws_directory} />

        <Box sx={{ display: "flex", width: "100%", height: `${window_size.height - APPBAR_HEIGHT}px` }} >
          <Grid container spacing={1} sx={{ height: "100%" }}>
            <Grid item xs={2}>
              <BasicList static_component_size={STATIC_COMPONENT_SIZE} window_size={window_size} />
            </Grid>
            <Grid item xs={10} sx={{ height: "100%" }}>
              {children}
            </Grid>
          </Grid >
        </Box > */}

        {children}
      </body>
    </html>
  )
}
