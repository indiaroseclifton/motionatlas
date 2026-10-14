"""Merge the 2026 specimen package into site/catalogue.json.

Adds 34 new Animation art entries (A41-A88), attaches extra renders (`gallery`) and
films (`film`) to new and existing entries. Safe to re-run: entries are replaced by id.

    python3 -I tools/add-specimens.py site/catalogue.json
"""
import json
import sys

R = 'assets/specimens/'
F = 'assets/films/'

# id: title, effort, medium, mood, desc, use, motion, build, avoid, test, alternate, checks, cues
NEW = [
 ('A41', 'Domino / chain-reaction cascade', 'High', 'Physics Or 3D', 'Expressive',
  'Sequential physical events propagate energy across a carefully arranged system. Each piece hands its motion to the next.',
  'Launch moments, onboarding sequences and cause-and-effect explainers.',
  'Let one push travel the whole chain; hold the last piece before it falls.',
  'Rigid-body simulation in 3D, or practical tabletop footage with a locked camera.',
  'Cutting away mid-cascade so the chain of cause is lost.',
  'Film a curved line of 40 wooden dominoes falling left to right in low raking light, ending on a tiny bell that rings.',
  'Branch the line into two paths that finish at the same moment.',
  'Every domino is pushed by the one before it. No piece falls early. Spacing stays consistent.',
  'Dark wooden tiles in raking light form a curved line mid-collapse, with a soft shadow trail.'),
 ('A47', 'Color cycling / palette animation', 'Low', 'Frame Animation', 'Calm',
  'A fixed image whose colors continuously shift through a designed palette, creating the illusion of motion without any change in geometry.',
  'Ambient backgrounds, loading states and retro game-style scenery.',
  'Rotate palette indices on a fixed image; water, fire and sky bands move while shapes stay still.',
  'Indexed-color canvas or a shader that offsets a gradient lookup over time.',
  'Cycling so fast that it strobes, or animating geometry and calling it palette motion.',
  'Cycle a layered landscape of rolling hills through a sunset palette over eight seconds without moving any outline.',
  'Run the same image through a night palette and compare the mood.',
  'No outline moves. The loop returns to the first frame without a jump. Contrast stays readable.',
  'Smooth rainbow contour bands flow across a stylised landscape of rolling layers.'),
 ('A48', 'Pixel sorting / glitch flow', 'Medium', 'Shader Or Video', 'Expressive',
  'Pixels are sorted along brightness or hue, producing long streaking flows. Animating the threshold or direction makes the image melt and reform.',
  'Music visuals, editorial transitions and experimental title sequences.',
  'Sweep the sorting threshold so streaks grow, pause and retract back into the photograph.',
  'Sort spans per row in a canvas or shader using a brightness mask.',
  'Sorting the whole frame until nothing of the source image survives.',
  'Sort a misty coastal cliff photograph horizontally by brightness, growing streaks for four seconds and retracting them for four.',
  'Sort vertically by hue instead and compare the texture.',
  'The source image stays recognisable. Streaks follow brightness, not random noise. The loop returns cleanly.',
  'A coastal landscape breaks into horizontal magenta and cyan streaks along its brightest bands.'),
 ('A49', 'Ferrofluid spikes', 'High', '3D Or Video', 'Expressive',
  'Magnetic fluid forms sharp, glossy black peaks and valleys that reshape under a changing field. Surfaces stay mirror-like with strong specular highlights.',
  'Premium product reveals, audio visualisers and tactile hero moments.',
  'Raise spikes in rings from the centre, let them travel outward and sink back into a calm pool.',
  'Displaced 3D surface with a high-gloss material, or macro practical footage.',
  'Matte materials that lose the liquid-metal reflections.',
  'Show a pool of ferrofluid in a dark studio as a hidden magnet raises concentric rings of spikes, then lowers them.',
  'Drive the spike height from a music track and compare the rhythm.',
  'Spikes grow from the surface rather than appearing. Reflections stay continuous. Motion settles between pulses.',
  'Glossy black liquid peaks rise in rings, catching sharp white highlights on a dark ground.'),
 ('A50', 'Thin-film interference (soap)', 'Medium', 'Shader Or Video', 'Calm',
  'Iridescent rainbow colors flow and shift across a curved soap film as its thickness changes. Colors are vivid, continuous and highly reflective.',
  'Holographic brand moments, beauty and fragrance, and soft hero backgrounds.',
  'Let colour bands drift and swirl with the draining film; keep the motion slow and liquid.',
  'A thin-film interference shader over a curved surface, or macro bubble footage.',
  'Using a flat rainbow gradient without the physical colour order.',
  'Film a large soap film on a black ground as rainbow bands swirl and drain toward the bottom edge.',
  'Compare a thick young film with a thin film about to burst.',
  'Colour order follows interference (bands, not a plain rainbow). The surface stays glossy. Motion is continuous.',
  'Swirling iridescent bands of magenta, gold and cyan over a dark curved film.'),
 ('A51', 'Mycelial network growth', 'Medium', 'Simulation Or Video', 'Calm',
  'Delicate white branching filaments explore and connect across a dark substrate, forming denser organic webs over time.',
  'Network, ecology and connection stories; slow background growth.',
  'Grow tips outward, branch and fuse filaments into loops as the web densifies.',
  'Agent-based growth (space colonisation) drawn to canvas, or time-lapse macro footage.',
  'Uniform fractal trees that never fuse into a network.',
  'Grow white hyphae from three seeds across dark soil for ten seconds until the networks meet and join.',
  'Feed the growth toward a single food source and compare the shape.',
  'Tips advance continuously. Branches fuse into loops. Growth never jumps between frames.',
  'Fine white filaments branch and knot across dark, crumbly soil.'),
 ('A52', 'Snowflake / crystal growth', 'Medium', 'Simulation Or Canvas', 'Precise',
  'Hexagonal ice structures advance outward from a seed, adding fine dendritic branches in stages. Translucent with subtle refraction.',
  'Winter campaigns, science explainers and precise, delicate reveals.',
  'Grow six arms in sync from a seed, adding side branches in stages; hold the finished crystal.',
  'Hexagonal cellular growth model (Reiter) or a staged vector build with sixfold symmetry.',
  'Breaking sixfold symmetry, or arms that grow at different rates.',
  'Grow a snowflake from a hexagonal seed on black for eight seconds, adding three generations of side branches.',
  'Compare a plate crystal with a fern-like dendrite.',
  'Six arms stay symmetric. Branches only grow outward. The final crystal holds still.',
  'A detailed six-armed ice crystal with glittering dendrites on black.'),
 ('A53', 'Suminagashi / ink marbling', 'Medium', 'Video', 'Calm',
  'Floating ink on water is drawn into organic, flowing patterns. Soft edges, concentric rings and delicate tendrils remain visible.',
  'Editorial and craft brands, calm transitions and Japanese-inspired identities.',
  'Drop alternating rings of ink, then draw a stylus through them so the rings swirl into tendrils.',
  'Practical overhead footage of a water tray, or a fluid simulation with ink advection.',
  'Fast turbulent motion that breaks the delicate lines.',
  'Film overhead as indigo and black ink rings are dropped onto water, then combed into a slow spiral.',
  'Compare a single swirl with a combed comb pattern.',
  'Lines stay continuous and do not blur. Motion is slow. The final pattern holds for two seconds.',
  'Indigo and black ink rings swirl into marbled tendrils on pale water.'),
 ('A54', 'Cyanotype blueprint', 'Low', '2D Or Video', 'Precise',
  'Deep Prussian blue technical drawings with crisp white linework. Visible paper texture and the slight chemical irregularities of the historic process.',
  'Technical product stories, maker brands and heritage explainers.',
  'Develop the print: let white linework emerge from the blue, then draw dimension lines in.',
  'SVG linework with stroke-draw animation over a textured blue paper image.',
  'Clean digital blue without paper grain or chemical variation.',
  'Develop a cyanotype of a brass spectroscope: lines appear over four seconds, then the parts list types in.',
  'Animate the same drawing as a plotter tracing each line in order.',
  'Line weights stay crisp. Paper texture persists. Labels remain readable.',
  'White technical drawing of a spectroscope with dimensions on deep Prussian blue paper.'),
 ('A55', 'Antique botanical plate', 'Medium', '2D Or Video', 'Calm',
  'Precise scientific illustration with fine linework and delicate hand-coloured details. Latin labels and plate numbering complete the archival look.',
  'Natural products, editorial features and heritage or education brands.',
  'Draw the engraving first, then let the hand-colouring wash in figure by figure.',
  'Layered SVG or line art over watercolour washes revealed with masks.',
  'Modern flat colour or sans-serif labels that break the archival voice.',
  'Reveal a columbine plate: engraved lines draw in, then violet and green washes fill figures 1 to 6.',
  'Compare a hand-coloured plate with an uncoloured proof.',
  'Linework precedes colour. Labels stay legible. Colour stays inside the engraved forms.',
  'Hand-coloured columbine with numbered figure studies and Latin captions on cream paper.'),
 ('A56', 'Harmonograph / mechanical drawing', 'Medium', 'Canvas', 'Precise',
  'Overlapping Lissajous-style curves drawn by a physical pendulum machine. Dense, continuous linework with slight mechanical irregularity.',
  'Science and engineering stories, generative identity marks and print-like reveals.',
  'Trace damped Lissajous curves live so the drawing densifies and slowly shrinks toward the centre.',
  'Compute two damped pendulums and draw the path to canvas; overlay engraved plate labels.',
  'Perfectly repeating curves with no damping, which read as digital.',
  'Draw a 3:2 harmonograph figure with gentle damping on a cream plate, labelled like an engineering print.',
  'Compare ratios 1:1, 2:1 and 3:2 side by side.',
  'Curves follow the stated ratio. Damping shrinks the figure gradually. The pen never jumps.',
  'An engraved harmonograph machine and its dense spiralling curve on an antique plate.'),
 ('A59', 'Pendulum wave synchronisation', 'Medium', 'Physics Or 3D', 'Precise',
  'Pendulums of slightly different lengths create travelling waves, apparent chaos and moments of perfect alignment.',
  'Rhythm and timing stories, loading states and calm science moments.',
  'Release all bobs together; show the snake waves, the chaos, then the realignment.',
  'Compute each pendulum period from its length; render in 3D or SVG.',
  'Faking the wave with a sine offset that never realigns.',
  'Swing 15 pendulums with periods chosen to realign after 60 seconds; show the wave forming and returning.',
  'Compare the pattern viewed from the side and from above.',
  'Periods derive from lengths. The bobs realign at the stated time. Swing amplitude stays small.',
  'A row of steel bobs on strings forms a travelling wave against a dark wooden frame.'),
 ('A60', 'Granular pour / sand cascade', 'Medium', 'Simulation Or Video', 'Calm',
  'A continuous stream of sand forms and collapses piles, with individual grains visible.',
  'Time and patience metaphors, natural materials and calm loops.',
  'Pour steadily so the cone grows, slumps at its angle of repose and grows again.',
  'Granular particle simulation (MPM) or macro practical footage.',
  'Fluid-looking sand without individual grains.',
  'Pour fine sand onto a growing cone in soft side light for ten seconds, including one small slump.',
  'Compare fine sand with coarse gravel.',
  'Grains stay visible. The pile keeps a stable angle. Slumps start at the surface.',
  'A thin stream of pale sand falls onto a softly lit, growing cone.'),
 ('A61', 'Ripple propagation', 'Low', 'Shader Or Video', 'Calm',
  'A single drop hits a liquid surface and sends circular waves expanding outward.',
  'Calm interactions, click feedback and wellness brands.',
  'Drop once, let the rings spread and fade before the next drop.',
  'Wave equation shader or a normal-map ripple on a reflective plane.',
  'Rings that expand without losing energy.',
  'Show one drop striking still grey water; rings expand and fade over five seconds.',
  'Use two drops and show interference where the rings cross.',
  'Ring spacing stays physical. Amplitude decays. The surface returns to calm.',
  'Concentric ripples spread across silver-grey water from a single drop.'),
 ('A62', 'Cloth / fabric in wind', 'High', '3D Or Video', 'Calm',
  'Soft fabric with folds, flutter and secondary motion driven by airflow.',
  'Fashion, interiors and soft product reveals.',
  'Lift the cloth on a gust, let the folds travel across it and settle.',
  'Cloth simulation in 3D or slow-motion practical footage.',
  'Rigid folds or looping flutter with no wind source.',
  'Float a sheet of white silk in soft side light as a slow gust passes from left to right.',
  'Compare silk with heavy linen in the same wind.',
  'Folds travel with the wind. Fabric weight reads correctly. The loop settles cleanly.',
  'A sheet of white silk billows and folds in soft studio light.'),
 ('A63', 'Light-painting trails', 'Medium', 'Canvas Or Webgl', 'Expressive',
  'Long-exposure-style moving lights build abstract drawings in real time.',
  'Nightlife, music and energetic brand moments.',
  'Draw loops with two coloured lights and let the trails accumulate, then fade.',
  'Additive-blend canvas trails or a persistence shader.',
  'Trails that never fade and clog the frame.',
  'Draw two light trails, amber and violet, looping around each other on black for eight seconds.',
  'Compare long-exposure accumulation with short fading trails.',
  'Trails are continuous. Additive colour glows where paths cross. The frame never washes out to white.',
  'Looping amber, violet and cyan light ribbons on black.'),
 ('A66', 'Infinite fractal zoom', 'High', 'Shader', 'Expressive',
  'A continuous zoom into a fractal with rich, self-similar detail.',
  'Psychedelic music visuals, mathematics stories and immersive openers.',
  'Zoom steadily toward a boundary point; detail keeps appearing at every scale.',
  'Mandelbrot shader with smooth colouring and double precision (or perturbation) for depth.',
  'Zooming into the flat interior where detail disappears.',
  'Zoom 1000x into the seahorse valley of the Mandelbrot set with a gold-on-navy palette.',
  'Compare smooth colouring with banded iteration colour.',
  'Detail persists throughout. The zoom speed stays constant. No pixel blocks appear.',
  'A golden Mandelbrot boundary with spiralling filaments on deep blue.'),
 ('A67', 'Bioluminescent trails', 'Medium', 'Canvas Or Webgl', 'Calm',
  'Soft glowing particles leave fading luminous paths that drift and dissipate in darkness.',
  'Ocean and night themes, ambient backgrounds and calm hero loops.',
  'Drift particles along slow currents; trails glow and fade behind them.',
  'Particle advection with fading trails and additive blend.',
  'Fast motion that turns the glow into streaks.',
  'Drift thousands of cyan plankton points along slow diagonal currents for ten seconds.',
  'Make the particles brighten when the cursor passes.',
  'Trails fade smoothly. Motion stays slow. No hard edges on the glow.',
  'Rivers of cyan bioluminescent particles drift across darkness.'),
 ('A69', 'Diffusion-limited aggregation', 'Medium', 'Simulation Or Canvas', 'Precise',
  'Branching, coral- or lightning-like structures grow outward as wandering particles stick on contact.',
  'Science explainers, growth metaphors and generative art prints.',
  'Grow the cluster outward from the seed, with tips advancing fastest.',
  'Random-walker DLA on a grid, rendered with glow.',
  'Symmetric trees that do not look stochastic.',
  'Grow a DLA cluster from a central seed until it fills a circle, coloured from white core to gold tips.',
  'Grow from a line seed instead of a point.',
  'Particles only attach on contact. Branches screen their neighbours. Growth is outward only.',
  'A golden, coral-like fractal cluster spreading from a bright centre on black.'),
 ('A70', 'Soap film collapse', 'Medium', 'Video', 'Expressive',
  'A thin soap film stretches across a wire frame and shows shifting colours, then collapses into droplets.',
  'Moments of change, product reveals and dramatic transitions.',
  'Hold the colour cycling, then pop the film from one edge into a spray of droplets.',
  'High-speed practical footage or a thin-film shader with a rupture mask.',
  'Collapsing the film too early, before the colour cycling has registered.',
  'Film an iridescent soap film on an irregular wire frame; it shimmers for six seconds then bursts.',
  'Reverse the clip so the film forms from droplets.',
  'Colours keep their interference order. The rupture travels from one point. Droplets fall with gravity.',
  'An iridescent soap film stretched across a twisted wire frame on black.'),
 ('A72', 'Embroidery stitch growth', 'Medium', 'Stop Motion Or 3D', 'Calm',
  'Stitches appear one by one, gradually building a pattern across fabric with visible thread texture.',
  'Craft, fashion and slow-living brands; patient reveals.',
  'Pass the needle through stitch by stitch so petals and leaves fill in.',
  'Stop-motion footage or vector stitch paths revealed in sequence with thread texture.',
  'Revealing whole areas at once instead of individual stitches.',
  'Stitch a pink flower and green leaves on linen, adding one satin stitch at a time.',
  'Compare satin stitch with cross stitch for the same motif.',
  'Each stitch has thickness and sheen. The needle leads the growth. Fabric weave stays visible.',
  'A satin-stitched pink flower and leaves on linen in an embroidery hoop.'),
 ('A75', 'Caustic swimming patterns', 'Medium', 'Shader', 'Calm',
  'Light refracted through moving water creates bright organic lines that constantly reorganise across a surface.',
  'Wellness, travel and summer campaigns; tranquil backgrounds.',
  'Let the caustic web drift and reorganise continuously.',
  'Caustics shader (Voronoi or refraction approximation) over a sand texture.',
  'Static caustic textures that only slide.',
  'Show sunlit caustics moving over a sandy pool floor for ten seconds, with a seamless loop.',
  'Compare shallow and deep water caustics.',
  'Lines reorganise rather than translate. Brightness varies naturally. The loop is seamless.',
  'Bright caustic lines ripple across sand under turquoise water.'),
 ('A76', 'Double pendulum trail', 'Medium', 'Canvas', 'Precise',
  'A double pendulum leaves a luminous chaotic path that densifies over time while staying bounded.',
  'Chaos and complexity stories, generative marks and science explainers.',
  'Release the pendulum and draw the end of the second arm; keep the trail building.',
  'Integrate the double pendulum equations (RK4) and draw the path.',
  'Hand-drawn random loops that do not respect the arm lengths.',
  'Simulate a double pendulum from a high release angle and trace the lower bob in cyan for twelve seconds.',
  'Run two pendulums with tiny differences and show them diverge.',
  'The path stays within the reach of both arms. Motion conserves energy. The trail never jumps.',
  'A cyan chaotic trail drawn by a double pendulum on black.'),
 ('A77', 'Paper-cut shadow theatre', 'Medium', '2D Or 3D', 'Expressive',
  'Layered cut silhouettes with intricate perforations move under directional coloured light, casting sharp theatrical shadows.',
  'Storytelling, children\'s media and seasonal campaigns.',
  'Move silhouette layers at different speeds and shift the coloured gels behind them.',
  'Layered 2D cut-outs with parallax and lighting, or practical lightbox footage.',
  'Soft blurry silhouettes without crisp cut edges.',
  'Stage a knight facing a dragon before a castle in layered paper cut-outs, lit from purple to amber.',
  'Compare a single-layer silhouette with a five-layer scene.',
  'Edges stay crisp. Layers move with parallax. Light changes are gradual.',
  'Layered paper silhouettes of a castle, two figures and a dragon in purple and orange light.'),
 ('A78', 'Reaction-diffusion / Turing patterns', 'Medium', 'Shader', 'Precise',
  'Spots, stripes and labyrinths emerge from simple local chemical-like rules. The forms feel biological yet mathematically precise.',
  'Biology and science themes, organic textures and evolving backgrounds.',
  'Morph slowly between spots and stripes by changing feed and kill rates.',
  'Gray-Scott model in a ping-pong shader.',
  'Random noise textures presented as reaction-diffusion.',
  'Run a Gray-Scott simulation that drifts from spots to labyrinth stripes over twelve seconds.',
  'Seed the pattern from a logo and let it grow outward.',
  'Patterns emerge from the rules. Transitions are gradual. Feature size stays consistent.',
  'Teal labyrinth stripes and spots in a precise, organic pattern.'),
 ('A79', 'Granular avalanche', 'High', 'Simulation Or Video', 'Expressive',
  'A pile of grains reaches a critical angle and collapses in a cascading flow of visible particles.',
  'Tension-and-release moments, natural forces and dramatic transitions.',
  'Build the slope until it fails, then let the avalanche run and settle.',
  'Granular simulation (MPM or DEM) or macro practical footage.',
  'A smooth liquid flow without individual grains.',
  'Tilt a bed of fine sand until it fails, showing the grains cascade for six seconds before settling.',
  'Compare dry sand with damp sand at the same angle.',
  'Failure starts at the surface. Individual grains stay visible. Debris settles at a stable angle.',
  'Fine golden sand grains cascading down a slope in raking light.'),
 ('A80', 'Lissajous drawing in progress', 'Medium', 'Canvas Or Video', 'Precise',
  'A mechanical pen traces overlapping curves on paper, building dense linework as the pendulums swing.',
  'Maker and engineering brands, generative marks and slow reveals.',
  'Follow the pen as each pass adds a line; the figure darkens and tightens.',
  'Compute the curve and draw it with a pen sprite, or film a real harmonograph.',
  'Drawing the full figure at once instead of pass by pass.',
  'Show a brass drawing machine tracing a 2:3 Lissajous figure in graphite on cream paper for twelve seconds.',
  'Change the phase halfway and compare the new figure.',
  'The pen leads the line. Each pass sits beside the last. The paper stays fixed.',
  'A brass pen arm traces dense looping graphite curves on cream paper.'),
 ('A81', 'Bioluminescent swarm', 'Medium', 'Canvas Or Webgl', 'Calm',
  'Clusters of soft glowing points move with flocking behaviour, leaving faint fading trails in darkness.',
  'Ambient heroes, nature and night themes, and collective metaphors.',
  'Swarm with separation, alignment and cohesion; let the cloud fold and stretch.',
  'Boids simulation with additive glow and short trails.',
  'Uniform particles moving in one direction like a screensaver.',
  'Animate 3,000 glowing blue boids folding into a ribbon and back into a cloud over ten seconds.',
  'Attract the swarm to the cursor.',
  'Agents follow flocking rules. The swarm stays cohesive. Trails remain faint.',
  'A cloud of glowing blue points swirls into a ribbon shape on black.'),
 ('A83', 'Shadow puppet / Wayang kulit', 'High', '2D Or Video', 'Expressive',
  'Layered cut leather or paper silhouettes with intricate perforations. Strong directional light, coloured gels and slight movement of the rods produce theatrical depth.',
  'Cultural storytelling, theatre and festival campaigns.',
  'Move the figures on their rods while the lamp flickers and coloured light shifts.',
  'Practical shadow-theatre footage or 2D rigged silhouettes with rod pivots.',
  'Ignoring the cultural source; credit the tradition and its makers.',
  'Stage three wayang figures before a lamp, raising one arm on its rod as the gels shift from red to blue.',
  'Compare the front (painted leather) and shadow side of the screen.',
  'Perforations read clearly. Arm motion pivots from the rods. Light shifts slowly.',
  'Ornate perforated silhouettes of wayang figures against red and blue gel light.'),
 ('A84', 'Lorenz / strange attractor', 'Medium', 'Canvas', 'Precise',
  'A single point traces a chaotic yet bounded path, building the dense two-lobed butterfly of the Lorenz system.',
  'Chaos theory explainers, data-art identities and technical heroes.',
  'Trace the point continuously so the two lobes fill in; rotate the view slowly.',
  'Integrate the Lorenz equations (σ 10, ρ 28, β 8/3) and draw in 3D projection.',
  'Drawing a figure-eight that ignores the real equations.',
  'Trace the Lorenz attractor for 20,000 steps, cyan on one lobe and magenta on the other, with parameter labels.',
  'Compare ρ 28 with ρ 14 to show the stable case.',
  'The path stays on the attractor. Lobe switching looks irregular. Parameters are stated.',
  'A glowing cyan and magenta Lorenz butterfly with parameter labels on black.'),
 ('A85', 'Hydraulic erosion terrain', 'High', 'Simulation Or Video', 'Calm',
  'Procedural mountains carved by simulated water. Sharp ridges, sediment fans and branching drainage patterns emerge naturally.',
  'Landscape and travel themes, geology explainers and epic openers.',
  'Run the erosion as a time-lapse so valleys deepen and rivers branch; drift the camera slowly.',
  'Heightfield erosion simulation (droplet or grid), rendered with an aerial camera.',
  'Plain noise mountains with no drainage network.',
  'Show an aerial time-lapse of eroding badlands where a braided river cuts its valley over ten seconds.',
  'Compare 100 and 10,000 erosion iterations.',
  'Drainage branches downhill. Sediment collects in fans. The camera never clips the terrain.',
  'Aerial badlands with sharp ridges and a braided river in afternoon light.'),
 ('A86', 'Cross-stitch / embroidery field', 'Medium', '2D Or Video', 'Calm',
  'Pixel-like stitches build images. Individual thread texture, slight irregularities and the fabric grid stay visible.',
  'Craft, nostalgia and home brands; pixel-art crossovers.',
  'Fill the image stitch by stitch along rows, as a needle would.',
  'Grid-based renderer with a stitch sprite per cell, or stop-motion.',
  'Perfectly uniform stitches that read as pixels, not thread.',
  'Build a cottage landscape in cross stitch, row by row, over ten seconds, framed by a floral border.',
  'Compare the image at stitch scale and at full scale.',
  'Every cell is an X stitch. Thread texture persists. The grid stays aligned.',
  'A cross-stitched cottage, stream and flower meadow in a decorative border.'),
 ('A87', 'Leaded stained glass', 'Medium', '2D Or Video', 'Calm',
  'Coloured glass held by dark leading. Light transmission, subtle glass texture and strong graphic silhouettes.',
  'Heritage, ceremony and hospitality brands; luminous reveals.',
  'Move the light behind the glass so colours glow and dim in sequence.',
  'Vector panes with lead outlines and an animated light mask, or practical footage.',
  'Flat colour with no transmitted glow.',
  'Sweep warm sunlight across a floral rose window over eight seconds so each pane brightens in turn.',
  'Compare day and dusk lighting on the same panel.',
  'Leading stays dark and continuous. Glass texture varies. Light moves smoothly.',
  'A floral rose-window panel of jewel-coloured glass with dark leading.'),
 ('A88', 'Metaball / blob morphing', 'Medium', 'Shader', 'Expressive',
  'Smooth liquid-like forms merge, split and reabsorb. Surfaces stay continuous while topology changes.',
  'Playful brands, loading states and soft tech heroes.',
  'Let blobs drift together, fuse with a smooth neck, then pull apart.',
  'Signed-distance metaballs with smooth-min in a shader, glossy material.',
  'Overlapping circles that never actually merge.',
  'Animate glossy blue and pink blobs merging into one form and splitting again over eight seconds.',
  'Compare a hard and a soft smooth-min blend.',
  'Surfaces stay continuous. Necks form before merging. Volume is roughly conserved.',
  'Glossy blue and magenta blobs connected by a liquid bridge on deep blue.'),
]

# extra renders and films
GALLERY = {
 'A41': 1, 'A47': 1, 'A48': 1, 'A49': 2, 'A50': 2, 'A51': 2, 'A52': 2, 'A53': 2, 'A54': 2, 'A55': 2,
 'A56': 2, 'A59': 1, 'A60': 1, 'A61': 1, 'A62': 1, 'A63': 2, 'A66': 1, 'A67': 2, 'A69': 1, 'A70': 1,
 'A72': 1, 'A75': 2, 'A76': 1, 'A77': 1, 'A78': 2, 'A79': 1, 'A80': 1, 'A81': 1, 'A83': 1, 'A84': 1,
 'A85': 1, 'A86': 1, 'A87': 1, 'A88': 1,
 'A02': 1, 'A03': 1, 'A06': 3, 'A07': 1, 'A08': 2, 'A09': 1, 'A24': 1, 'A26': 1, 'A29': 3, 'A32': 3,
 'A33': 1, 'A36': 1, 'A37': 1, 'A39': 2,
}
FILMS = {
 'A08': 'sand-drawing', 'A53': 'suminagashi', 'A67': 'bioluminescent-trails', 'A48': 'pixel-sorting',
 'A49': 'ferrofluid', 'A56': 'harmonograph-plate', 'A80': 'lissajous-drawing', 'A70': 'soap-film',
 'A85': 'hydraulic-erosion', 'A72': 'embroidery', 'A26': 'game-of-life',
}


def prompts(title, test, alternate, motion, checks, cues):
    return {
        'Still image': ('Create ONE still image, not an animation or a sequence. Show a completed or held frame of '
                        f'this scene: {test} Composition: clear focal point, consistent perspective and generous space '
                        f'around important content. Visual cues: {cues} Lighting: coherent with the medium. Deliver a '
                        'clean 4:3 reference and a square detail; no watermark. Use original art direction and identify '
                        'any schematic or generated data.'),
        'Video': (f'Create an 8-second demonstration of {title}. Subject: {alternate} From 0-2 seconds establish the '
                  f'initial state. From 2-6 seconds: {motion} From 6-8 seconds hold a clear final state. Use a fixed '
                  'camera unless movement explains the subject. Keep labels readable and avoid flashes. Supply a poster '
                  f'frame and static alternative. Check: {checks}'),
        'Working interface': (f'Build an interactive preview panel for a {title} asset. Use a supplied rendered or '
                              f'generated reference whose visual cues are: {cues} Keep production method and provenance '
                              'labelled. Offer play/pause, replay, speed and a complete static reduced-motion view when a '
                              'clip is supplied. Do not pretend that moving a still performs the underlying physical '
                              'process or simulation. Provide keyboard and touch controls, visible focus and a '
                              'failed-media fallback. Verify that the useful final state remains readable and all '
                              'controls work.'),
    }


# New visual styles drawn from the cyanotype and botanical plates (themes live in site/atlas-themes.js)
STYLES = [
 ('S21', 'Cyanotype', 'blueprint', 'Low', 'Css + Svg', 'Tool', 'Precise',
  'Prussian-blue technical drawing: white linework, dimension lines, parts tables and a faint grid on chemically uneven paper.',
  'Engineering and maker brands, product specs, documentation sites and heritage science stories.',
  'Lines draw in like a plotter, dimensions extend from their ends, and labels type in once the line lands.',
  'Two-colour palette, condensed engineering capitals with a monospace body, hairline borders and a 24px grid backdrop.',
  'Drawing everything at once, or using so many dimension lines that the product disappears.',
  'Design a product specification page styled as a cyanotype blueprint: an elevation drawing with dimensions, a parts list table and a request-a-quote button.',
  'Design a documentation landing page with a blueprint hero that draws itself and a numbered parts index.',
  'Text stays readable on blue, the grid is subtle, and the call to action is the brightest element.',
  'Prussian blue ground; white hairlines; dimension arrows; parts table; condensed capitals; paper mottling.', 'L32'),
 ('S22', 'Botanical plate', 'botanical', 'Medium', 'Css + Svg', 'Editorial', 'Calm',
  'Antique natural-history plate: engraved linework with soft hand-coloured washes, numbered figures, Latin captions and a ruled border on cream.',
  'Natural products, apothecary and beauty brands, gardens, museums and slow editorial.',
  'Engraving draws first, then colour washes in figure by figure; captions fade in after each figure.',
  'Cream paper, ink-brown text, one plant colour as the accent, an old-style serif for titles and a book serif for body.',
  'Modern flat colour, sans-serif labels or too many figures competing for attention.',
  'Design a product page for a botanical skincare range styled as an antique plate: a central plant illustration, numbered ingredient figures with Latin names and an add-to-bag button.',
  'Design a garden tour landing page as a natural-history plate with figure captions as navigation.',
  'The plate feels archival, figures are clearly numbered, and the price and button stay obvious.',
  'Cream paper; engraved lines; violet and sage washes; numbered figures; italic Latin captions; ruled border.', 'L36'),
]


def style_prompts(title, test, alternate, motion, build, avoid, checks, cues):
    p = prompts(title, test, alternate, motion, checks, cues)
    p['Working interface'] = (f'Build a working, responsive web interface in the {title} style. Brief: {test} Use semantic '
                              'HTML, visible focus states, real labels and WCAG 2.2 AA contrast. Motion: '
                              f'{motion} Respect prefers-reduced-motion. Build notes: {build} Avoid: {avoid} Check: {checks}')
    return p


def img(code, n):
    return {'url': f'{R}{code.lower()}-{n}.webp', 'index': 0, 'columns': 1, 'rows': 1}


def main(path):
    cat = json.load(open(path))
    by_id = {e['id']: e for e in cat}
    for (i, title, effort, medium, mood, desc, use, motion, build, avoid, test, alt, checks, cues) in NEW:
        e = {
            'id': i, 'title': title, 'kind': 'specimen', 'desc': desc, 'use': use, 'motion': motion,
            'build': build, 'avoid': avoid, 'tags': 'MEDIUM / ' + medium.upper(), 'test': test,
            'alternate': alt, 'checks': checks, 'cues': cues, 'group': 'Animation art', 'effort': effort,
            'medium': medium, 'purpose': 'Illustration', 'mood': mood, 'image': img(i, 1),
            'prompts': prompts(title, test, alt, motion, checks, cues), 'isNew': True,
        }
        if i in by_id:
            by_id[i].update(e)
        else:
            cat.append(e)
            by_id[i] = e
    for i, n in GALLERY.items():
        e = by_id[i]
        first = 2 if e.get('isNew') else 1   # new entries already use render 1 as their main image
        e['gallery'] = [img(i, k)['url'] for k in range(first, n + 1)]
        if not e['gallery']:
            del e['gallery']
    for e in cat:
        e.pop('film', None)
    for i, slug in FILMS.items():
        by_id[i]['film'] = {'src': f'{F}{slug}.mp4', 'poster': f'{F}{slug}.jpg', 'seconds': 14}
    # films added later with tools/add-film.sh are named by entry code, e.g. assets/films/a41.mp4
    import os
    films_dir = os.path.join(os.path.dirname(os.path.abspath(path)), 'assets', 'films')
    for e in cat:
        name = e['id'].lower()
        if e['id'][0] == 'A' and os.path.exists(os.path.join(films_dir, name + '.mp4')):
            e['film'] = {'src': f'{F}{name}.mp4', 'poster': f'{F}{name}.jpg', 'seconds': 14}
    for (i, title, kind, effort, medium, purpose, mood, desc, use, motion, build, avoid, test, alt, checks, cues, fx) in STYLES:
        e = {
            'id': i, 'title': title, 'kind': kind, 'desc': desc, 'use': use, 'motion': motion, 'build': build,
            'avoid': avoid, 'tags': effort.upper() + ' / ' + medium.upper(), 'test': test, 'alternate': alt,
            'checks': checks, 'cues': cues, 'group': 'Styles', 'effort': effort, 'medium': medium,
            'purpose': purpose, 'mood': mood, 'isNew': True, 'pairs': {'theme': i, 'effect': fx},
            'prompts': style_prompts(title, test, alt, motion, build, avoid, checks, cues),
        }
        if i in by_id:
            by_id[i].update(e)
        else:
            cat.append(e)
            by_id[i] = e
    # keep A entries in id order
    a = sorted([e for e in cat if e['id'][0] == 'A'], key=lambda e: int(e['id'][1:]))
    it = iter(a)
    cat = [next(it) if e['id'][0] == 'A' else e for e in cat]
    json.dump(cat, open(path, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(len(cat), 'entries;', sum(1 for e in cat if e.get('film')), 'with film;',
          sum(len(e.get('gallery', [])) for e in cat), 'gallery renders')


if __name__ == '__main__':
    main(sys.argv[1])
