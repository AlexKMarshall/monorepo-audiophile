export default function CategoryPage({
  params,
}: {
  params: { categoryName: string }
}) {
  return (
    <div>
      <h1>Category Page {params.categoryName} </h1>
    </div>
  )
}
