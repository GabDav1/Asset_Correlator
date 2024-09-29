# Asset Correlator

Use this tool to rapidly identify correlation between pair of assets:
- Visualize price correlation on the time chart.
- Calculate the divergence score as well as the Pearson correlation measure.

## Usage

One of the best ways to use this app is via URL parametrization. This is what you need to know:

- ?q= TICKER parameter, enter desired tickers after "=" sign, separated by commas.
The idea is the app will take all pairs of tickers that can possibly form and generate the correlations.

EXAMPLE: if you enter [?q=vale-ibm](https://gabdav1.github.io/Asset_Correlator/?q=vale-ibm), the app will generate correlations for the pairs VALE-IBM.
But for [?q=vale-ibm-nvda](https://gabdav1.github.io/Asset_Correlator/?q=vale-ibm-nvda), you will get all the possible pairs between these 3 ( so vale-ibm, vale-nvda and ibm-nvda).

The default time-frame is weekly and default data points is 100, so you get the correlation for 100 weeks if these parameters are not specified.

- ?t= Time-Frame parameter, choose whether you want daily, weekly or monthly data.
The inputs are "day" for daily, "wk" for weekly and "mo" for monthly.

EXAMPLE: for [?q=vale-ibm?t=mo](https://gabdav1.github.io/Asset_Correlator/?q=vale-ibm?t=mo).
This will give you the vale-ibm correlation for the last 100 months (100 is the default value for the data point parameter).

- ?d= Data Points parameter, any integer that will be the number of desired data points.

EXAMPLE: for [?q=vale-ibm?d=200](https://gabdav1.github.io/Asset_Correlator/?q=vale-ibm?t=mo?d=200).
This will give you the vale-ibm correlation for the last 200 months.

Otherwise just use it via UI, selecting the ticker for the first asset (blue box) and second asset (orange box), the time frame and one of the datapoint presets (100, 200 or 400).

On the table rendered on the right: 
- "% divergence" represents number of data points(as a percentage) from the selected assets that are diverging (heading in opposite directions).
- "Score" represents the "strength" of that divergence, how hard the 2 assets moving away from each other.
- "Pearson" represents the Pearson correlation value, that can have any value from -1 to 1 (-1 is strong reverse correlation, 1 is strong positive correlation, 0 is no correlation at all). 

## Access it Live

### You can try it live now here:

https://gabdav1.github.io/Asset_Correlator/
