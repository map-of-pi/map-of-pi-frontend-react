const verticalLines = () => {
  return <div style={{width: '6%', height: '15px', borderInline: 'solid 1px black'}}></div>;
};

export default function TrustMeter(props: any) {
  const maxRating = 5; // this can be adjusted
  const percentageRating = (props.ratings / maxRating * 100).toString();
  const average = 3; // this can be adjusted

  const lines = Array.from({ length: 8 }, (_, i) => i); // Generates an array [0, 1, 2, ..., 8]

  return (
    <>
      <div className="flex align-center mt-2">
        <div className={`${props.ratings < average ? 'bg-red-700' : 'bg-green-700'} rounded-full p-5 w-[5px] h-[5px]`}></div>
        <div className={`rounded-e-[15px] h-[15px] w-full my-auto -ms-1 ${props.ratings < average ? 'bg-red-200' : 'bg-green-200'}`}>
          <div
            className={`${props.ratings < average ? 'bg-red-700' : 'bg-green-700'} h-[15px] rounded-e-[15px]`}
            style={{width: `${percentageRating}%`}}
          ></div>
        </div>
      </div>
      <div className="mb-3 w-full ms-[40px]">
        <div className="flex gap-[6%] overflow-hidden">
          {lines.map((_, index) => (
            <div key={index} style={{width: '6%', height: '15px', borderInline: 'solid 1px black'}}></div>
          ))}
        </div>
        <div className="w-full flex">
          <span>0%</span>
          <span className="ms-[33%]">50%</span>
          <span className="ms-[15%]">80%</span>
          <span className="ms-[10%]">100%</span>
        </div>
      </div>
    </>
  );
}
