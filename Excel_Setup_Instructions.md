# Bug Tracking Excel Setup Instructions

## Step 1: Import CSV Files
1. Create new Excel workbook
2. Import each CSV as separate sheets:
   - `Bug_Database.csv` → "Bug Database" sheet
   - `Bug_Submission_Form.csv` → "Bug Submission Form" sheet  
   - `Dashboard.csv` → "Dashboard" sheet

## Step 2: Set Up Data Validation

### Bug Submission Form Sheet:
1. **Status Field (G column)**:
   - Select the Status cell
   - Data → Data Validation → List
   - Source: `Open,In Progress,Resolved`

2. **Required Fields**:
   - Select Feature Name cell (B column)
   - Data → Data Validation → Custom
   - Formula: `=LEN(B2)>0`
   - Error message: "Feature Name is required"
   
   - Repeat for Expected Behavior (C column) and Actual Behavior (D column)

## Step 3: Set Up Formulas

### Bug Submission Form:
- **ID Field**: `=COUNTA('Bug Database'!A:A)`
- **Date Field**: `=TODAY()`

### Dashboard:
- All formulas are already provided in the CSV
- They will reference the 'Bug Database' sheet automatically

## Step 4: Create Chart
1. Go to Dashboard sheet
2. Select Status Breakdown data (Status and Count columns)
3. Insert → Pie Chart
4. Title: "Bug Status Distribution"

## Step 5: Formatting
- Format Date columns as dates
- Apply conditional formatting to Status column (Green=Resolved, Yellow=In Progress, Red=Open)
- Make headers bold

## Usage:
1. Fill out Bug Submission Form
2. Copy data to new row in Bug Database
3. Dashboard updates automatically