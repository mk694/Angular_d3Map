import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as sampleData from '../assets/sample.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}
  // backgroundPage= "#494D5F";
  themes: any = [
    {
      name: 'Normal',
      width: 775,
      height: 850,
      scale: 525,
      initalFreq: 0,
      defaultRadius: 6,
      backgroundMapColor: '#E5EAF5',
      mapColor: '#fff',
      mapStroke: '#d2ceff',
      mapStrokeWidth: 1,
      colorConstant: 0.5,
      startColor: 'red',
      stopColor: 'yellow',
      endColor: 'green',
      countryTextColour: 'blue',
      countryTextSize: '10px',
      legendTextSize: '14px',
      legendTextColor: '#000000',
    },
    {
      name: 'Amber',
      width: 775,
      height: 850,
      scale: 525,
      initalFreq: 0,
      defaultRadius: 6,
      backgroundMapColor: '#E5EAF5',
      mapColor: '#F5DE7A',
      mapStroke: '#8e824a',
      mapStrokeWidth: 1,
      colorConstant: 0.5,
      startColor: 'blue',
      stopColor: 'yellow',
      endColor: 'red',
      countryTextColour: '#531a1a',
      countryTextSize: '10px',
      legendTextSize: '14px',
      legendTextColor: '#000000',
    },
    {
      name: 'Graphene',
      width: 775,
      height: 850,
      scale: 525,
      initalFreq: 0,
      defaultRadius: 6,
      backgroundMapColor: '#494D5F',
      mapColor: '#222222',
      mapStroke: '#d2ceff',
      mapStrokeWidth: 1,
      colorConstant: 0.5,
      startColor: '#1eec40',
      stopColor: 'yellow',
      endColor: 'red',
      countryTextColour: '#ffffff',
      countryTextSize: '10px',
      legendTextSize: '14px',
      legendTextColor: '#ffffff',
    },
  ];
  themeIndex = 0;
  currentTheme = this.themes[0];
  backgroundPage: any = this.currentTheme.backgroundMapColor;

  ngOnInit(): void {
    this.createMap();
  }

  changeTheme(theme: any) {
    this.currentTheme = this.themes[theme];
    this.themeIndex = theme;
    this.backgroundPage = this.currentTheme.backgroundMapColor;
    this.createMap();
  }

  createMap(): void {
    // let currentZoomLevel: any = 1;

    d3.select('#legendContainer').select('svg').remove();
    const legendSvg = d3.select('#legendContainer').append('svg');
    const svg = d3.select('#europeMap');

    svg.selectAll('path').remove();
    svg.selectAll('text').remove();
    svg.selectAll('circle').remove();
    svg.selectAll('g').remove();

    svg
      .attr('height', this.currentTheme.height)
      .attr('width', this.currentTheme.width)
      .style('background-color', this.currentTheme.backgroundMapColor);

    const projection: any = d3
      .geoMercator()
      .scale(this.currentTheme.scale)
      .center([this.currentTheme.width / 2, this.currentTheme.height / 2]);

    const path = d3.geoPath().projection(projection);

    // const zoom: any = d3
    //   .zoom()
    //   .scaleExtent([1, 10])
    //   .on('zoom', (event) => {
    //     currentZoomLevel = event.transform.k;

    //     svg.selectAll('path').attr('transform', event.transform);
    //     svg.selectAll('circle').attr('transform', event.transform);
    //   });

    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');
    // svg.call(zoom);

    // Setting up the map of europe
    d3.json('assets/europe.geojson').then((data: any) => {
      // const geoData = topojson.feature(data, data.objects.europe);

      svg
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .style('stroke', this.currentTheme.mapStroke)
        .style('stroke-width', this.currentTheme.mapStrokeWidth)
        .style('fill', this.currentTheme.mapColor);

      // Adding country names
      svg
        .selectAll('text')
        .data(data.features)
        .enter()
        .append('text')
        .attr('x', (d: any) => path.centroid(d)[0])
        .attr('y', (d: any) => path.centroid(d)[1])
        .attr('text-anchor', 'middle')
        .attr('font-size', this.currentTheme.countryTextSize)
        .attr('fill', this.currentTheme.countryTextColour)
        .text((d: any) => d.properties.ISO2);

      // Adding groups for each data point
      const groups = svg.selectAll('g').data(sampleData).enter().append('g');

      // Create the rings (pulse effect) within each group
      groups
        .append('circle')
        .attr('class', 'pulse-ring')
        .attr('cx', (d: any) => projection(d.destinationLatlong.coordinates)[0])
        .attr('cy', (d: any) => projection(d.destinationLatlong.coordinates)[1])
        .attr('r', 10)
        .style('fill', 'none')
        .style('stroke', (d) =>
          this.circleColor(d.destinationPostcode)
        ) /* Adjust the color as needed */
        .style('stroke-width', '1')
        .style('opacity', 0.3);

      // Adding circles for each location within each group
      groups
        .append('circle')
        .attr('class', 'pulse')
        .attr('cx', (d: any) => projection(d.destinationLatlong.coordinates)[0])
        .attr('cy', (d: any) => projection(d.destinationLatlong.coordinates)[1])
        .attr('fill', (d, i) => this.circleColor(d.destinationPostcode))
        .attr('r', (d: any) => {
          return this.circleSize(d.destinationPostcode);
        })
        .on('mouseover', (event, d: any) => {
          tooltip
            .html(
              `
        <div>
          <strong>City:</strong> ${d.destinationCity}
        </div>
        <div>
          <strong>Postal Code:</strong> ${d.destinationPostcode}
        </div>
        <div>
          <strong>Coordinates:</strong> ${d.destinationLatlong.coordinates
            .map((item: number) => {
              return item.toFixed(6);
            })
            .join(', ')}
        </div>
        <div>
          <strong>Intensity:</strong> ${this.shipmentFrequencyIndex(
            d.destinationPostcode
          ).toFixed(3)}
        </div>
      `
            )
            .style('visibility', 'visible');
        })
        .on('mousemove', (event) => {
          tooltip
            .style('left', event.pageX + 5 + 'px')
            .style('top', event.pageY - 5 + 'px');
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });
    });

    // Legend bar
    legendSvg.attr('width', this.currentTheme.width).attr('height', 100); // Set a suitable height for the legend

    legendSvg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'legendGradient')
      .selectAll('stop')
      .data([
        { offset: '0%', color: this.currentTheme.startColor },
        { offset: '50%', color: this.currentTheme.stopColor },
        { offset: '100%', color: this.currentTheme.endColor },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // Append a group to hold the legend elements
    const legendGroup = legendSvg.append('g').attr('class', 'legendGroup');
    const legendBarWidth = this.currentTheme.width - 40;

    // Add the gradient bar
    legendGroup
      .append('rect')
      .attr('x', 20)
      .attr('y', 40)
      .attr('width', legendBarWidth)
      .attr('height', 20)
      .style('fill', 'url(#legendGradient)');

    // Add labels for the legend
    const labels = [
      { offset: '0%', position: 20, text: '0' },
      { offset: '25%', position: legendBarWidth * 0.25 + 20, text: '0.25' },
      { offset: '75%', position: legendBarWidth * 0.75 + 20, text: '0.75' },
      { offset: '100%', position: legendBarWidth + 24, text: '1' },
    ];

    labels.forEach((label) => {
      legendGroup
        .append('text')
        .attr('x', label.position)
        .attr('y', 32)
        .attr('font-size', this.currentTheme.legendTextSize)
        .attr('fill', this.currentTheme.legendTextColor)
        .attr('text-anchor', label.offset === '100%' ? 'end' : 'middle')
        .text(label.text);
    });

    legendGroup
      .append('text')
      .attr('x', 15)
      .attr('y', 78) // Adjust the y-coordinate to position the text below the legend bar
      .attr('font-size', this.currentTheme.legendTextSize)
      .attr('fill', this.currentTheme.legendTextColor)
      .attr('text-anchor', 'start') // To anchor the text at the start
      .text('Intensity Index');

    // Add circles at each end

    //Left circle
    legendGroup
      .append('circle')
      .attr('cx', 20)
      .attr('cy', 50)
      .attr('r', 10)
      .style('fill', 'none')
      .style('stroke', this.currentTheme.startColor)
      .style('stroke-width', '6');
    legendGroup
      .append('circle')
      .attr('cx', 20)
      .attr('cy', 50)
      .attr('r', 9)
      .style('fill', 'none')
      .style('stroke', 'white')
      .style('stroke-width', '6');
    legendGroup
      .append('circle')
      .attr('cx', 20)
      .attr('cy', 50)
      .attr('r', 10)
      .style('fill', this.currentTheme.startColor);

    //Right circle
    legendGroup
      .append('circle')
      .attr('cx', legendBarWidth + 20)
      .attr('cy', 50)
      .attr('r', 10)
      .style('fill', 'none')
      .style('stroke', this.currentTheme.endColor)
      .style('stroke-width', '6');
    legendGroup
      .append('circle')
      .attr('cx', legendBarWidth + 20)
      .attr('cy', 50)
      .attr('r', 9)
      .style('fill', 'none')
      .style('stroke', 'white')
      .style('stroke-width', '6');
    legendGroup
      .append('circle')
      .attr('cx', legendBarWidth + 20)
      .attr('cy', 50)
      .attr('r', 10)
      .style('fill', this.currentTheme.endColor);
  }
  shipmentFrequencyIndex = (postalCode: string) => {
    const sample: any = sampleData;

    const selectedOrders = sample.default.filter((item: any) => {
      return item.destinationPostcode == postalCode;
    });
    const fresult = selectedOrders.length / Object.keys(sampleData).length;
    return fresult;
  };

  circleSize = (postalCode: string) => {
    const sample: any = sampleData;

    const selectedOrders = sample.default.filter((item: any) => {
      return item.destinationPostcode == postalCode;
    });

    let radius = 0;

    if (
      selectedOrders.length > this.currentTheme.initalFreq ||
      (this.currentTheme.initalFreq > 0.25 &&
        this.currentTheme.initalFreq < 0.75)
    ) {
      this.currentTheme.initalFreq = selectedOrders.length;
      radius = this.currentTheme.defaultRadius + 3.5;
      return radius;
    }
    return (radius = this.currentTheme.defaultRadius);
  };

  circleColor = (postalCode: string) => {
    const frequency = this.shipmentFrequencyIndex(postalCode);

    if (frequency < this.currentTheme.colorConstant) {
      console.log(d3.interpolateRgb(
        this.currentTheme.startColor,
        this.currentTheme.stopColor
      )(frequency / this.currentTheme.colorConstant));

      return d3.interpolateRgb(
        this.currentTheme.startColor,
        this.currentTheme.stopColor
      )(frequency / this.currentTheme.colorConstant);
    }
    if (frequency == this.currentTheme.colorConstant) {
      return this.currentTheme.stopColor;
    }
    if (frequency > this.currentTheme.colorConstant) {
      return d3.interpolateRgb(
        this.currentTheme.stopColor,
        this.currentTheme.endColor
      )(
        (frequency - this.currentTheme.colorConstant) /
          this.currentTheme.colorConstant
      );
    }
    return this.currentTheme.startColor;
  };
}
