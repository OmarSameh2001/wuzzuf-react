import '../../ComponentsStyles/CompanyProcess/calender_switcher.css';

const DynamicSwitcher = (({ getter, setter, id }) => {
  
  // console.log(id);
  return (
    <div className="calendar-switcher">
    <input
      type="checkbox"
      id={"view-toggle"}
      className="toggle-checkbox"
      checked={getter}
      onChange={() => setter(!getter)}
    />
    <label htmlFor="view-toggle" className="toggle-label">
      <span className="toggle-inner"></span>
      <span className="toggle-switch"></span>
    </label>
  </div>
  );
});

export default DynamicSwitcher;
