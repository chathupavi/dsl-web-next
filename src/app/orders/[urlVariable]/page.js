import AllOrdersClient
  from "@/components/AllOrdersClient";


export default async function OrdersPage({
  params,
}) {

  const {
    urlVariable,
  } = await params;


  return (
    <AllOrdersClient
      urlVariable={
        urlVariable
      }
    />
  );
}