import { redirect } from 'next/navigation'

// The list/CRUD view is now the default at /admin/categories; keep this old
// path working by redirecting.
export default function ManageRedirect() {
  redirect('/admin/categories')
}
