import { BarChart } from '@mui/x-charts/BarChart';

export const GraphicComponent = ({title, data, graphType}:{title: string, data: any[], graphType: "bar-chart"}) => {

    return(
        <div className='bg-neutral-300 rounded p-2'>
            <div className='bg-neutral-100 rounded p-2'>
                {graphType==="bar-chart" &&(
                    <BarChart
                    series={[{data: data.map(tuple => tuple[1])}]}
                    height={250}
                    xAxis={[{ data: data.map(tuple => tuple[0]), scaleType: 'band' }]}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    />
                )}
            </div>
            <div className='bg-neutral-100 rounded p-2 mt-2'>
                <p className='text-2xl text-neutral-600 text-center'>{title}</p>
            </div>
        </div>
    );
}