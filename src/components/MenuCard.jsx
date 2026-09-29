
function MenuCard({ menu }) {

    function onMenuClick(){
        alert("clicked")
    }   

    return <div className="menu-card">
        <div className="menu-image">
            <img src={menu.url} alt={menu.title} />
            <div className="menu-overlay">
                <button className="btn" onClick={onMenuClick}></button>
        
            </div>
        </div>
    </div>;
}

export default MenuCard 