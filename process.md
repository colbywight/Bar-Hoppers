

# I. Project Proposal

### Basic Info
Title: School Funding Influence on Student Performance across U.S.  
Colby Wight: colbywight5@gmail.com #A01632572  
Marina Johnson: mkumi5995@gmail.com #A02304894  
Url: https://github.com/colbywight/Bar-Hoppers  

### Background and Motivation
Our motivation for this project was correlating education and funding of schools. My personal research interest is the improvement of education through technology. Thus, the first steps in this process is knowing where the system lacks and can be improved. Although financial data and influence is not directly related to technology helping students rate of improvement. However, using technology to improve funding in education (namely to reduce funding) yet improve performance is an appeal to start using more technology in education; if it does in fact improve areas such as test scores while requiring less funding, especially over time. 
We believe the education of students will influence how our society progresses and are interested in improving the system by correlating influential factors. 

### Project Objectives
Our main objective is to create a visualization that shows both student success rate and school funding in a way that users can create with their own hypotheses on why there is or isn't a correlation between the two throughout different areas across the US. It might also be beneficial to further break down student success by different subjects to see how funding is tied to individual subjects. 

Specific questions that could be answered with this vis:  
What states and areas of the united states perform best academically?  
How is school funding correlated with academic performance across the united states?  
Within an individual state what subjects are students best at?  

There are multiple benefits that could come from this work. The most obvious is to see what the correlation is between funding and academic success. We hope this visualization will spark other questions and give inspiration to other ideas on what other factors might be correlated with academic success.  We could also learn what subjects students from different locations excel at to better understand how we can all contribute to the betterment of our society in different ways. 

### Data
Our data will come from a few sources. Namely data providing test scores of students for different states. Data providing financial information of schools by states. And data providing financial information of households.  



https://www.nationsreportcard.gov/data_tools.aspx  
https://www.kaggle.com/spscientist/students-performance-in-exams  
https://www.kaggle.com/noriuk/us-education-datasets-unification-project  
https://www.kaggle.com/kabure/eda-us-education-finances  
https://www.kaggle.com/goldenoakresearch/us-household-income-stats-geo-locations  

### Data Processing

The data sources listed above come in pretty nice tabular format already. There will be some work required to interpret the data properly from different sources such as the test scores, and the financial information, which will probably be connected through a feature most likely location based. The student subject scores can be selected to get the information and resolution we desire, such as what subjects test scores we want and for the years and states we want the information, and we can pull these directly into excel or csv file formats. This should make the data processing we need to do fairly minimal. Each row or item of our combined master dataset could be indexed by the state and year. For the columns or attributes, we will have things such as year and state, and then for each of these year/state combinations we will have each of the different test scores for school subjects, the average test scores, and a column for the amount of funding each state receives. Data processing will be implemented in Python using libraries such as Pandas to clean, merege, and explore the data if necessary. Although, most of our data will be fairly clean and accurate from the looks of it. 

### Visualization Design

As far as the visualization goes we were thinking of doing a US map for sure. This map will hold the bulk of our data visualization we are trying to present to the user. We have a few ideas that could be selected depending on how clear each idea presents the data. The first would be a series of heat maps. Especially for information such as annual income. We could also do a heatmap for school performance if our data can provide district/region information that is mappable (aka. We don’t have to google where every school district is located). We also want to show how well states do in subjects along with which subjects that states does particularly well in. However for the purpose of showing the correlation of attributes that can affect a schools performance, the overall performance will be more important to show than which subject a region or state is best at. We were thinking we could encode a schools performance in a subject by saturation. Where we can show different subjects by color hue. With this information we could juxtapose maps to show different subjects or we could use jump cuts or find a way to overlay the data. Maybe we could add a symbol or some sort of chart over top the map by state.

We thought about encoding some third factor (whether it be school funding, the average income of households, or ethnicity) as size. However, this poses the problem of readability. If a state is too small and we’re using color and saturation to encode other variables, would it be readable? We also thought about doing a separate graph off to the side that could show different data for a selected state. So a user could select a state and see more detailed information about it. They could also select multiple states to add to the graph (whether it be line or bar). This is limited by clutter, but I think a user would intuitively see that right away and select less states. 

For time (as we might have year data depending on the completeness of the data) We could use some sort of line graph to show overall patterns of a selected state. Or we could have a slider over a year bar or just have a drop down where they can select a year and show the map for it. 

One alternate for our design is multiple bar charts, that could be stacked by subject, grouped by subject or stacked by state and grouped by state (this requires interaction) for the map. We could also do something similar to the soccer statistics where it lists out each state as a row and column as data about that states education, an influencing attribute (household income, etc) and have a graph representation. Where the rows could be sorted by different columns. However, I find this to be too simple and would need something extra to make it special in my opinion. The final idea we could use to replace is a symbol map. Just have our barcharts or whatever data representation we choose overlayed on a map which shows both the information and the location. Then if a user selects that state, we could show a scaled version of it, as the symbols will probably be fairly small considering the entire US needs to be shown. This is a visual very simple to the one we are planning on using. We are not completely convinced this could show the data better than a heat map, or something similar to that. 

add sketches here.

### Must-Have Features

-Map of some sort to show the link of our education data with our factor data  
-State-by-state interaction, to show more detail about our data especially to show why a certain state could be “succeeding” more.  
-overall performance state by state either shown on the map or otherwise (However, I would consider not showing it on the map as a failure) to show correlation between how well a state does and our influencing factor.  

### Optional Features

-line graph to show time (we could have a user just select a year and show that information rather than compare it over time, I don’t think time will be our focus comparison in this visualization)
-state by state subject performance shown on the map. This isn’t our main focus as we just want to show performance related to either state funding and household income or some other influencing factor. How well a state does in map vs reading isn’t our main focus. However, it would be interesting to see and could also be a tool for where school funding should be used. That or it could show correlation between our influencing factor and what subjects they tend to do well in. 

### Project Schedule
Week1 (Nov. 4-11): Finish proposal and outlining project in code (like the backbone of writing methods and outlining our html layout)  
Week2 (Nov. 11-18): Refining, laying out, and loading our data. Also, should get our map up and displaying at least one of our data features.  
Week3 (Nov. 18-25): Displaying all features on map and getting our influencing factor feature encoded in map or other visual entity if needed.  
Week4 (Nov. 25-Dec. 2): Having all our data displayed and refining our visualizations. Cleaning up clutter where needed and making sure our data is cleany represented.  
Week5 (Dec. 2-Due Date): Any final details being added, making it look pretty, cleaning up code, adding comments.  
