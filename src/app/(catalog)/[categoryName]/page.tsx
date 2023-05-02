export default function CategoryPage({
  params,
}: {
  params: { categoryName: string }
}) {
  return (
    <div>
      <h1>{params.categoryName}</h1>
    </div>
  )
}
