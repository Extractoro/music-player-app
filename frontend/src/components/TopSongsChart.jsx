import React, {useEffect, useState} from 'react'
import {getTopSongs} from "../api/statistics.js";
import {toast} from "react-toastify";
import ReactApexChart from "react-apexcharts";

const TopSongsChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                background: '#212124',
            },
            fill: {
                colors: ['#a766ff']
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "55%",
                    borderRadius: 5,
                },
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: [],
            },
            theme: {
                mode: "dark",
            },
            title: {
                text: 'Top 10 Songs by Playlist Additions',
                align: 'center',
                margin: 20,
                offsetY: 20,
                 style: {
                    fontSize: '15px'
                 }
            }
        },
    });

    const loadData = async () => {
        try {
            const data = await getTopSongs();
            const songs = data.data;

            const songTitles = songs.map((item) => item.song_title);
            const addCounts = songs.map((item) => item.add_count);

            setChartData((prevState) => ({
                series: [
                    {
                        name: "Additions",
                        data: addCounts,
                    },
                ],
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: songTitles,
                    },
                },
            }));

        } catch (err) {
            toast.error(err.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    return (
        <div>
            <h2></h2>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
            />
        </div>
    )
}
export default TopSongsChart
