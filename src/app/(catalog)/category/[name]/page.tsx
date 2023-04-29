export default function CategoryPage({ params }: { params: { name: string } }) {
  return (
    <div>
      <h1>Category Page {params.name} </h1>
    </div>
  )
}
