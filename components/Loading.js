import { useLoading, Oval } from '@agney/react-loading';

function Loading() {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval width="50" />,
    loaderProps: {
        // Any props here would be spread on to the indicator element.
        style: { 
            color: "blue", 
            position: 'fixed',
            left: '50%',
            top: '45%',
            zIndex: '9999',
        }
      }
  });

  return (
    <section {...containerProps}>
      {indicatorEl}
    </section>
  );
}

export default Loading