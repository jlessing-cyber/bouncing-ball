<div id="controls">
    <div class="control-group">
        <label>Gravity</label>
        <input type="range" id="gravity" min="0.1" max="2" step="0.01" value="0.5">
        <div class="value-display" id="g-val">0.50</div>
    </div>

    <div class="control-group">
        <label>Initial Height</label>
        <input type="range" id="height" min="50" max="500" step="1" value="300">
        <div class="value-display" id="h-val">300px</div>
    </div>

    <div class="control-group" style="min-width: 200px;">
        <label>Energy Conservation</label>
        <div style="width: 200px; height: 20px; background: #30363d; border-radius: 4px; overflow: hidden; display: flex;">
            <div id="pe-bar" style="height: 100%; background: #238636; width: 50%; transition: width 0.05s;"></div>
            <div id="ke-bar" style="height: 100%; background: #1f6feb; width: 50%; transition: width 0.05s;"></div>
        </div>
        <div class="value-display" style="font-size: 12px; margin-top: 5px;">
            <span style="color: #238636;">● PE</span> 
            <span style="color: #1f6feb; margin-left: 10px;">● KE</span>
        </div>
    </div>

    <button class="btn-reset" id="resetBtn">Drop Ball</button>
</div>
