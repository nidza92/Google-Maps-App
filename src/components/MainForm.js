import classes from './styling/MainForm.module.css'

function MainForm(props) {
  return (
    <form onSubmit={props.handleSubmit} className={classes.form}>
      <div className={classes.formControl}>
        <label htmlFor='search-box'>Add coordinates</label>
        <p>
          Example: <br /> 44.964798,2.741100,blue <br />
          38.548165,-0.299215 <br /> 38.548165,10.958296,purple
        </p>
      </div>
      <div>
        <textarea
          className={classes.formControl}
          id='search-box'
          rows={5}
          value={props.addBatchMarkers}
          onChange={props.handleChange}
        />
      </div>
      <div>
        <input type='submit' value='Submit' className={classes.formBtn} />
      </div>
    </form>
  )
}

export default MainForm
