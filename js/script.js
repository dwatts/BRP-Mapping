      require([
        "esri/WebScene",
        "esri/views/SceneView", 
        "esri/layers/FeatureLayer",
        "esri/symbols/PolygonSymbol3D",
        "esri/symbols/ExtrudeSymbol3DLayer",  
        "esri/renderers/SimpleRenderer",  
        "esri/layers/ElevationLayer",
        "esri/layers/BaseElevationLayer",
        "esri/layers/TileLayer",
        "esri/layers/VectorTileLayer",
        "esri/core/watchUtils",
        //"esri/widgets/Editor",

      ], function(WebScene, SceneView, FeatureLayer, PolygonSymbol3D,
      ExtrudeSymbol3DLayer, SimpleRenderer, ElevationLayer, BaseElevationLayer, TileLayer, VectorTileLayer, watchUtils, /*Editor*/ ) {
        
        const ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
          properties: {
            exaggeration: 1.5
          },
          load: function() {
            this._elevation = new ElevationLayer({
              url:
                "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            this.addResolvingPromise(this._elevation.load());
          },
          fetchTile: function(level, row, col) {
            return this._elevation.fetchTile(level, row, col).then(
              function(data) {
                var exaggeration = this.exaggeration;
                for (var i = 0; i < data.values.length; i++) {
                  data.values[i] = data.values[i] * exaggeration;
                }
                return data;
              }.bind(this)
            );
          }
        });
            
        const vancBounds = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/VA_NC_Bounds/FeatureServer",
            maxScale: 0,
            minScale: 0,
            visible: true,
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [64, 64, 64, 0],
                outline: {
                  color: [0,0,0, 0.2],
                  width: 1,
                  style: "solid"    
                }
              }
            }
          });   

        const trailRender = {
          type: "simple",
          symbol: {
            type: "line-3d",  
            symbolLayers: [{
              type: "line", 
              size: 1, 
              material: { color: "#543400" },
              cap: "round",
              join: "round"
            }]
          }  
        };
                    
        const brpTrails = new FeatureLayer({
          url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Trails_Simplified/FeatureServer",
          opacity: 0.6,
          maxScale: 0,
          minScale: 75000,    
          visible: true,
          renderer: trailRender,
          popupTemplate: {
                outFields: ["*"],
                  //title: "{name_e}",
                  content: function (feature) {
                    return setContentInfoThree(feature.graphic.attributes);
                  },    
              },        
          });
          
        function setContentInfoThree(results) {
            var hikingIcon = "<img class='icon' alt='' src='img/Hiking_Black.png'/>";
                        
            var popupElementThree = document.createElement("div");
            
            var notesText = (
                results.Notes === ' ' ? "" :
                'Notes: '
            );
            
            popupElementThree.innerHTML = "<table><tbody><tr><td><h1>" + results.Name + "</h1></td></tr></tbody></table><table class='iconTable'><tbody><tr><td>" + hikingIcon + "</td></tr></tbody></table><h3><b>Length: </b>" + results.Trl_Lngth + " miles</h3><h3><b>Type: </b>" + results.Type + "</h3><h3><b>Difficulty: </b>" + results.Difficulty + "</h3><h3><b>Access Point(s): </b>" + results.Assoc_Ovlk + "</h3><h3><b>" + notesText + "</b>" + results.Notes + "</h3>";
            
            return popupElementThree;
            
        }; 

        const trailRenderBack = {
          type: "simple",
          symbol: {
            type: "line-3d",  
            symbolLayers: [{
              type: "line", 
              size: 5,  
              material: { color: "#e0b775" },
              cap: "round",
              join: "round"
            }]
          }  
        };
          
        const brpTrailsBack = new FeatureLayer({
          url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Trails_Simplified/FeatureServer",
          opacity: 0.5,
          visible: true,
          maxScale: 0,
          minScale: 15000,    
          popupEnabled: false,
          renderer: trailRenderBack   
        }); 
              
////////////Context Layers/////////////
                    
        const placesLabel = {
           labelPlacement: "above-center",
              labelExpressionInfo: {
                value: "{PLACE}, {STATE}"
              },
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                      
                  material: {
                    color: [102, 102, 102]
                  },
                  halo: {
                    color: [255, 255, 255, 0.8],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                  size: 8,   
                }],
                verticalOffset: {
                  screenLength: 60,
                  maxWorldLength: 200,
                  minWorldLength: 10
                },
                callout: {
                  type: "line", 
                  size: .5,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0]
                  }
                }
              } 
        }; 
          
        const vancPlaces = new FeatureLayer({
              url:
                "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/VA_NC_Places/FeatureServer",
              elevationInfo: {
                mode: "on-the-ground",
              },
              renderer: {
                  type: "simple",
                  symbol: {
                    type: "polygon-3d",
                    symbolLayers: [{
                      type: "fill",
                      material: {
                        color: [161, 161, 161, 0.3]
                      }
                    }]
                }
            },
            labelingInfo: []
        }); 
            
        const natParkLabel = {
           labelPlacement: "above-center",
              labelExpressionInfo: {
                value: "{UNITNAME}"
              },
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                      
                  material: {
                    color: [102, 102, 102]
                  },
                  halo: {
                    color: [255, 255, 255, 1],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                  size: 8,   
                }],
                verticalOffset: {
                  screenLength: 80,
                  maxWorldLength: 500,
                  minWorldLength: 30
                },
                callout: {
                  type: "line", 
                  size: .5,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0]
                  }
                }
              } 
        };  
        
        const othNatParks = new FeatureLayer({
              url:
                "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Oth_National_Parks/FeatureServer",
              elevationInfo: {
                mode: "on-the-ground",
              },
              maxScale: 0,
              minScale: 150000,
              renderer: {
                  type: "simple",
                  symbol: {
                    type: "simple-fill",
                    color: [161, 142, 93, 0],
                    outline: {
                        color: "#665b3f",
                        width: 0,
                        style: "solid"
                    }
                 }
              },
              labelingInfo: [natParkLabel]
        });  
                    
        const overlookLabel = {
              labelPlacement: "above-center",
              labelExpressionInfo: {
                value: "{Name}"
              },
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                      
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 1],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                  size: 8.5,   
                }],
                VerticalOffset: {
                  screenLength: 7,
                  maxWorldLength: 250,
                  minWorldLength: 50
                },
                callout: {
                  type: "line", 
                  size: 1,
                  color: [0, 0, 0],
                  border: {
                    color: [255, 255, 255, 0]
                  }
                }
              }
            };

        var overlookTemplate = {
            outFields: ["*"],
              //title: "{name_e}",
              content: function (feature) {
                return setContentInfo(feature.graphic.attributes);
              },    
        };
          
        const brpOverlooks = new FeatureLayer({
            url:"https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Overlooks/FeatureServer",
            renderer: overlookRenderer,
            definitionExpression: "type NOT IN ('Peak', 'Lake', 'Gap', 'Falls', 'River', 'Parkway Administration', 'Maintenance Yard')",
            outFields: ["*"],
            screenSizePerspectiveEnabled: true,
            labelingInfo: [],
            popupEnabled: true,
            popupTemplate: overlookTemplate       
        });
          

          
        function setContentInfo(results) {
            //var Admin = "<img class='icon' alt='' src='img/RangerStation_Black.png'/>";
            var Boating = "<img class='icon' alt='' src='img/Boating_Black.png'/>";
            var Bike = "<img class='icon' alt='' src='img/Bikes_Black.png'/>";
            var Camping = "<img class='icon' alt='' src='img/Camping_Black.png'/>";
            var Grocery = "<img class='icon' alt='' src='img/Grocery_Black.png'/>";
            var GiftShop = "<img class='icon' alt='' src='img/GiftShop_Black.png'/>";
            var Hiking = "<img class='icon' alt='' src='img/Hiking_Black.png'/>";
            var Info = "<img class='icon' alt='' src='img/Info_Black.png'/>";
            var Interp = "<img class='icon' alt='' src='img/Interpretation_Black.png'/>";
            var Lodging = "<img class='icon' alt='' src='img/Lodging_Black.png'/>";
            var Monument = "<img class='icon' alt='' src='img/Monument_Black.png'/>";
            var View = "<img class='icon' alt='' src='img/Overlook_Black.png'/>";
            var Parking = "<img class='icon' alt='' src='img/Parking_Black.png'/>";
            var Picnic = "<img class='icon' alt='' src='img/Picnic_Black.png'/>";
            var Point = "<img class='icon' alt='' src='img/PointofInterest_Black.png'/>";
            var Ranger = "<img class='icon' alt='' src='img/Ranger_Black.png'/>";
            var Restaurant = "<img class='icon' alt='' src='img/Restaurant_Black.png'/>";
            var RestRoom = "<img class='icon' alt='' src='img/Restroom_Black.png'/>"; 
            var Scenic = "<img class='icon' alt='' src='img/ScenicView_Black.png'/>";

            var elevFormat = results.Elev.toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,                
            });
            
            var elevation = (
                elevFormat === 0 ? "N/A" :
                elevFormat
            );
            
            /*var elevation = (
                results.Elev === 0 ? "N/A" :
                results.Elev
            );*/
                        
            var details = (
                results.Details === '' ? "" :
                'Details: '
            );
            
            var notes = (
                results.Notes1 === ' ' ? "" :
                'Notes: '
            );
            
            var state = (
                results.State === 'VA' ? "Virginia" :
                'North Carolina'
            );
            
            var useOne = (
                //results.Use1 == 'Administration' ? Admin :
                results.Use1 == 'Camping' ? Camping :
                results.Use1 == 'Gift Shop' ? GiftShop :
                results.Use1 == 'Hiking' ? Hiking :
                results.Use1 == 'Information' ? Info :
                results.Use1 == 'Interest' ? Point :
                results.Use1 == 'Interpretation' ? Interp :
                results.Use1 == 'Lodging' ? Lodging :
                results.Use1 == 'Monument' ? Monument :
                results.Use1 == 'Parking' ? Parking :
                results.Use1 == 'Picnic' ? Picnic :
                results.Use1 == 'View' ? View :
                ''
            );
            
            var useTwo = (
                results.Use2 == 'Bathroom' ? RestRoom :
                results.Use2 == 'Gift Shop' ? GiftShop :
                results.Use2 == 'Hiking' ? Hiking :
                results.Use2 == 'Information' ? Info :
                results.Use2 == 'Interpretation' ? Interp :
                results.Use2 == 'Parking' ? Parking :
                results.Use2 == 'Picnic' ? Picnic :
                results.Use2 == 'Restaurant' ? Restaurant :
                results.Use2 == 'View' ? View :
                ''
            );
            
            var useThree = (
                results.Use3 == 'Bathroom' ? RestRoom :
                results.Use3 == 'Gift Shop' ? GiftShop :
                results.Use3 == 'Groceries' ? Grocery :
                results.Use3 == 'Hiking' ? Hiking :
                results.Use3 == 'Picnic' ? Picnic :
                results.Use3 == 'View' ? View :
                ''
            );
            
            var useFour = (
                results.Use4 == 'Bathroom' ? RestRoom :
                results.Use4 == 'Gift Shop' ? GiftShop :
                results.Use4 == 'Hiking' ? Hiking :
                results.Use4 == 'Information' ? Info :
                results.Use4 == 'Picnic' ? Picnic :
                results.Use4 == 'View' ? View :
                ''
            );
            
            var useFive = (
                results.Use5 == 'Biking' ? Bike :
                results.Use5 == 'Gift Shop' ? GiftShop :
                results.Use5 == 'Hiking' ? Hiking :
                results.Use5 == 'Interpretation' ? Interp :
                results.Use5 == 'Restaurant' ? Restaurant :
                ''
            );
            
            /*var useSix = (
                results.Use6 == 'Restaurant' ? Restaurant :
                ''
            );*/
            
            var useOneText = (
                //results.Use1 == 'Administration' ? "Administration" :
                results.Use1 == 'Camping' ? "Camping" :
                results.Use1 == 'Gift Shop' ? "Gift Shop" :
                results.Use1 == 'Hiking' ? "Hiking" :
                results.Use1 == 'Information' ? "Information" :
                results.Use1 == 'Interest' ? "Point of Interest" :
                results.Use1 == 'Interpretation' ? "Interpretation" :
                results.Use1 == 'Lodging' ? "Lodging" :
                results.Use1 == 'Monument' ? "Monument" :
                results.Use1 == 'Parking' ? "Parking" :
                results.Use1 == 'Picnic' ? "Picnic" :
                results.Use1 == 'View' ? "View" :
                '' 
            );
            
            var useTwoText = (
                results.Use2 == 'Bathroom' ? "Restroom" :
                results.Use2 == 'Gift Shop' ? "Gift Shop" :
                results.Use2 == 'Hiking' ? "Hiking" :
                results.Use2 == 'Information' ? "Information" :
                results.Use2 == 'Interpretation' ? "Interpretation" :
                results.Use2 == 'Parking' ? "Parking" :
                results.Use2 == 'Picnic' ? "Picnic" :
                results.Use2 == 'Restaurant' ? "Restaurant" :
                results.Use2 == 'View' ? "View" :
                ''
            );
            
            var useThreeText = (
                results.Use3 == 'Bathroom' ? "Restroom" :
                results.Use3 == 'Gift Shop' ? "Gift Shop" :
                results.Use3 == 'Groceries' ? "Groceries" :
                results.Use3 == 'Hiking' ? "Hiking" :
                results.Use3 == 'Picnic' ? "Picnic" :
                results.Use3 == 'View' ? "View" :
                ''
            );
            
            var useFourText = (
                results.Use4 == 'Bathroom' ? "Restroom" :
                results.Use4 == 'Gift Shop' ? "Gift Shop" :
                results.Use4 == 'Hiking' ? "Hiking" :
                results.Use4 == 'Information' ? "Information" :
                results.Use4 == 'Picnic' ? "Picnic" :
                results.Use4 == 'View' ? "View" :
                ''
            );
            
            var useFiveText = (
                results.Use5 == 'Biking' ? "Bicycling" :
                results.Use5 == 'Gift Shop' ? "Gift Shop" :
                results.Use5 == 'Hiking' ? "Hiking" :
                results.Use5 == 'Interpretation' ? "Interpretation" :
                results.Use5 == 'Restaurant' ? "Restaurant" :
                ''
            );
            
            /*var useSixText = (
                results.Use6 == 'Restaurant' ? "Restaurant" :
                ''
            );*/
            
            var popupElement = document.createElement("div");
            
            popupElement.innerHTML = "<table><tbody><tr><td><h1>" + results.Name + "</h1></td></tr></tbody></table><h3><b>Type:</b> " + results.Type + "</h3><h3><b>Milepost:</b> " + results.MilePost + "</h3><h3><b>State:</b> " + state + "</h3><h3><b>Elevation:</b> " + elevation + " ft" + "</h3><h3><b>Activities & Amenities:</b></h3><table class='iconTable'><tbody><tr><td>" + useOne + "</td><td>" + useTwo + "</td><td>" + useThree + "</td><td>" + useFour + "</td><td>" + useFive + "</td></tr><tr><td class='iconText'>" + useOneText + "</td><td class='iconText'>" + useTwoText + "</td><td class='iconText'>" + useThreeText + "</td><td class='iconText'>" + useFourText + "</td><td class='iconText'>" + useFiveText + "</td></tr></tbody></table><h3><b>" + details + "</b> " + results.Details + "</h3><h3><b>" + notes + "</b> " + results.Notes1 + " "+ results.Notes2+ " " + results.Notes3+ " " + results.Notes4 + " " + results.Notes5 + "</h3>";
            
            return popupElement;
            
        };
          
        const brpPeaks = new FeatureLayer ({
            url:"https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Overlooks/FeatureServer",
            renderer: peaksRenderer,
            definitionExpression: "type IN ('Peak', 'Lake', 'River', 'Falls')",
            maxScale: 0,
            minScale: 75000,
            labelingInfo: [{
              labelExpressionInfo: {
                  expression: document.getElementById("label").text
                },
              /*labelExpressionInfo: {
                value: "{Name} ({Elev} ft)"   
              },*/    
              labelPlacement: "above-center",    
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                  horizontalAlignment: "right",    
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 1],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                      
                  size: 7.5,   
                }],
              } 
            }]
        });
                  
        const brpTunnels = new FeatureLayer ({
            url:"https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Overlooks/FeatureServer",
            renderer: rendTunnSmall,
            definitionExpression: "type IN ('Tunnel', 'Terminus', 'Maintenance Yard', 'Parkway Administration')",
            popupTemplate: {
            outFields: ["*"],
              //title: "{name_e}",
              content: function (feature) {
                return setContentInfoTwo(feature.graphic.attributes);
              },    
          },        
        });
          
        function setContentInfoTwo(results) {
            var tunnelIcon = "<img class='icon' alt='' src='img/Tunnel_Black.png'/>";
            var termIcon = "<img class='icon' alt='' src='img/Entrance_Black.png'/>";
            var maintIcon = "<img class='icon' alt='' src='img/Maintenance_Black.png'/>";
            var adminIcon = "<img class='icon' alt='' src='img/RangerStation_Black.png'/>";
            
            var tunnText = (
                results.Type == 'Tunnel' ? "Tunnel Length: " :
                results.Type == 'Terminus' ? "Details: " :
                results.Type == 'Maintenance Yard' ? "Details: " :
                results.Type == 'Parkway Administration' ? "Details: " :
                ''
            );
            
            var iconChoice = (
                results.Type == 'Tunnel' ? tunnelIcon :
                results.Type == 'Terminus' ? termIcon :
                results.Type == 'Maintenance Yard' ? maintIcon :
                results.Type == 'Parkway Administration' ? adminIcon :
                ''
            );
            
            var popupElementTwo = document.createElement("div");
            
            popupElementTwo.innerHTML = "<table><tbody><tr><td><h1>" + results.Name + "</h1></td></tr></tbody></table><table class='iconTable'><tbody><tr><td>" + iconChoice + "</td></tr></tbody></table><h3><b>Milepost: </b>" + results.MilePost + "</h3><h3><b>" + tunnText + "</b>" + results.Details + "</h3>";
            
            return popupElementTwo;
            
        };
          
        const milePosts = new FeatureLayer ({
            url:"https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_MileMarkers/FeatureServer",
            renderer: mpRenderer,
            maxScale: 0,
            minScale: 15000,
            labelingInfo: [{
              labelExpressionInfo: {
                value: "MP {MILEPOST}"
              },    
              labelPlacement: "above-center",    
              symbol: {
                type: "label-3d",
                symbolLayers: [{
                  type: "text",
                  horizontalAlignment: "right",    
                  material: {
                    color: [0, 0, 0]
                  },
                  halo: {
                    color: [255, 255, 255, 1],
                    size: 1
                  },
                  font: {
                    weight: "normal",
                    family: "Roboto Mono"
                  },
                      
                  size: 7.5,   
                }],
              } 
            }]
        });  
          
        const intersections = new FeatureLayer ({
           url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Intersections/FeatureServer",
           renderer: interRenderer,
           maxScale: 0,
           minScale: 75000,    
           popupTemplate: {
           outFields: ["*"],
              //title: "{name_e}",
              content: function (feature) {
                return setContentInfoInter(feature.graphic.attributes);
              },    
          },        
        });

        function setContentInfoInter(results) {
            var interstateIcon = "<img class='icon' alt='' src='img/Interstate.png'/>";
            var routeIcon = "<img class='icon' alt='' src='img/State_Route.png'/>";

            var interIcon = (
                results.Type == 'Interstate' ? interstateIcon :
                results.Type == 'US Route' ? routeIcon :
                results.Type == 'State Route' ? routeIcon :
                ''
            );

            var popupElementInter = document.createElement("div");

            popupElementInter.innerHTML = "<table><tbody><tr><td><h1>Blue Ridge Parkway Access</h1></td></tr></tbody></table><h3><b>Road Name: </b>" + results.Name + "</h3><h3><b>Milepost: </b>" + results.MilePost + "</h3>";

            return popupElementInter;
        };  
          
////////////3d Buildings, Bridges and Trees//////////////
          
        const brpBridges = new FeatureLayer ({
           url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Bridges_Points/FeatureServer/0",
           elevationInfo: {
               mode: "absolute-height"
           },    
           renderer: bridgeRenderer,    
           opacity: 1,
        });
          
        const tunnelRenderer = {
            type: "simple",
            symbol: {
                type: "point-3d",
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            href: "./3d/Tunnel_Face.glb"
                        },
                        height: 15,
                        anchor: "relative",
                        //heading: 80
                    }
                ]
            },
            visualVariables: [
                {
                    type: "rotation",
                    field: "Heading",
                    rotationType: "geographic",
                    axis: "heading"
                }
            ]
        };  
          
        const tunnels = new FeatureLayer ({
           url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Tunnel_Faces/FeatureServer",
           renderer: tunnelRenderer,    
           opacity: 1,
        });
           
        const brpBuildings3d = new FeatureLayer ({
           url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Buildings_PointZM_Z/FeatureServer",
           renderer: buildingRenderer,
           elevationInfo: {
              mode: "absolute-height"
           },
           opacity: 1,
        });
          
        const trees = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/BRP_Trees/FeatureServer",
            elevationInfo: {
                mode: "on-the-ground",
            },
            opacity: 0.7,
            maxScale: 0,
            minScale: 35000,
            renderer: treeRenderer,
        });
        
        const moreTrees = new FeatureLayer({
          url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/More_Trees/FeatureServer",
          elevationInfo: {
              mode: "on-the-ground",
          },
          opacity: 0.7,
          maxScale: 0,
          minScale: 20000,
          renderer: treeRenderer,
      });

////////////State Labels//////////////
          
        var labelRenderer = new SimpleRenderer({
            symbol: new PolygonSymbol3D({
              symbolLayers: [
                  {
                    type: "extrude", 
                    material: {
                      color: [64, 64, 64, 1]
                    },
                    edges: {
                      type: "solid",
                      color: [0,0,0,0],
                      size: 1
                    }
                  }
                ]
            }),
            visualVariables: [{
              type: "size",
              field: "Hght",
              valueUnit: "feet"
            }]
          });      
          
        const stateLabels = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/State_Names_Roboto/FeatureServer",
            maxScale: 0,
            minScale: 600000,
            opacity: 0.8,
            visible: true,
            renderer: labelRenderer,
            elevationInfo: {
                mode: "relative-to-ground",
                offset: 200,
                unit: "feet"
           }, 
        });            
          
          
        ////////////Tile Layers: Non-BRP Roads & Waterways//////////////  
           
        const tileBaseMap = new VectorTileLayer({
            url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/BRP_Base_Map_New_07152021/VectorTileServer",
        });  
        
        const baseMap = new TileLayer({
            url: "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"
        })
            
        /////Set Scene View/////

       var webscene = new WebScene({
            layers: [baseMap, tileBaseMap, vancBounds, othNatParks, vancPlaces, brpTrailsBack,brpTrails, tunnels, brpPeaks, brpOverlooks, brpTunnels, intersections, milePosts, brpBridges, brpBuildings3d, moreTrees, trees, stateLabels],
            ground: {
                layers: [new ExaggeratedElevationLayer()]
            }
        });
          
        webscene.ground.opacity = 1

        var view = new SceneView({
          container: "viewDiv",
          highlightOptions: {
            color: [229, 88, 37],
            fillOpacity: 0.4
          },    
          map: webscene,
          viewingMode: "global",
          qualityProfile: "high",
          alphaCompositingEnabled: false,
          popup: {
              collapseEnabled: false,
              featureNavigationEnabled: true, 
              dockEnabled: true,
              dockOptions: {
                  buttonEnabled: false,
                  breakpoint: false
              } 
          },    
          ui: {
              components: ["zoom"]
          },    
          environment: {
            background:{
                type: "color", 
                color: [255,255,255, 1]
            },
            lighting: {
                directShadowsEnabled: true
              },  
            atmosphereEnabled: false,
            starsEnabled: false
          },
          camera: {
            position: {
              latitude: 37.41,//36.549390,   
              longitude: -79.65, //-80.913475,    
              z:  3311.22//850000
            },
            tilt: 67.77, //0
            heading: 51.01 //0
          },
          constraints: {
              altitude: {
                min: 700,
                max: 900000,
              },
              tilt: {
                  max: 75
              }
            }
        });
        
        view.ui.move( "zoom", "manual"); 
          
        view.popup.viewModel.actions = false;  
          
        /*var editor = new Editor({
          view: view
        });
        // Add widget to top-right of the view
        view.ui.add(editor, "top-right");*/

        view.watch('camera.tilt', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });
          
        view.watch('camera.position', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });
          
        view.watch('camera.heading', function(newValue, oldValue, property, object) {
          console.log(property , newValue);
        });

        watchUtils.whenTrueOnce(view, "updating", function(evt) {
          $("#loaderDiv").show();
        });

        watchUtils.whenFalse(view, "updating", function(evt) {
          $("#loaderDiv").hide();
        });

        
        ////////////Add Scale-Based Renderers///////////////  
          
        view.when().then(function() {     
            view.watch("scale", function(newValue) {
            if (newValue <= 7000) {
                return brpTunnels.renderer = rendTunnLarge  
            } else if (newValue > 7000 && newValue <= 17224) { 
                return brpTunnels.renderer = rendTunnMedium
            } else if (newValue > 17224 ) {
                return brpTunnels.renderer = rendTunnSmall
            } else {
                return brpTunnels.renderer = rendTunnSmall
            }
          });
        });

        view.when().then(function() {     
            view.watch("scale", function(newValue) {
            vancPlaces.labelingInfo =
              newValue <= 50000 ? [placesLabel]: [];
          });
        });

        view.when().then(function() {     
            view.watch("scale", function(newValue) {
            brpOverlooks.labelingInfo =
              newValue <= 7000 ? [overlookLabel]: [];
          });
        });  
          
        view.when().then(function() {     
            view.watch("scale", function(newValue) {
            if (newValue <= 7000) {
                return brpOverlooks.renderer = overlookRendererThree  
            } else if (newValue > 7000 && newValue <= 17224) { 
                return brpOverlooks.renderer = overlookRendererTwo
            } else if (newValue > 17224 ) {
                return brpOverlooks.renderer = overlookRenderer
            } else {
                return brpOverlooks.renderer = overlookRenderer
            }
          });
        });

//////Radio Buttons/////
       
      $(document).ready(function() {
            $('input:radio[name=type]').change(function() {
                if (this.value == 'overlook') {
                    filtFunctionOne(this);
                }
                else if (this.value == 'visitor') {
                    filtFunctionTwo(this);
                }
                else if (this.value == 'point') {
                    filtFunctionThree(this);
                }
            });
        });      
          
       function filtFunctionOne() {
                  view.when(function() {
                    return brpOverlooks.when(function() {
                      var query = brpOverlooks.createQuery();
                      return brpOverlooks.queryFeatures(query);
                    });
                  })
                  .then(getValuesOne)
                  .then(getUniqueValuesOne)
                  .then(addToSelectOne);

                function getValuesOne(response) {    

                  var features = response.features;  
                  var values = features.map(function(feature) {
                    if (feature.attributes.Type == 'Overlook' || feature.attributes.Type == 'Parking Area') {
                        return feature.attributes.Name;
                    } else {
                        return '';
                    }
                  });
                  return values;
                }

                function getUniqueValuesOne(values) {
                  var uniqueValues = [];

                  values.forEach(function(item, i) {
                    if (
                      (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
                      item !== ""
                    ) {
                      uniqueValues.push(item);
                    }
                  });
                  return uniqueValues;
                }

                function addToSelectOne(values) {
                  $('#stateFilter').empty().append('<option value="">(Select an Overlook)</option>');    
                  values.sort();
                  values.forEach(function(value) {
                    var option = document.createElement("option");
                    option.text = value;
                    stateFilter.add(option);
                  });
            }
        }
          
        function filtFunctionTwo() {
                  view.when(function() {
                    return brpOverlooks.when(function() {
                      var query = brpOverlooks.createQuery();
                      return brpOverlooks.queryFeatures(query);
                    });
                  })
                  .then(getValuesTwo)
                  .then(getUniqueValuesTwo)
                  .then(addToSelectTwo);

                function getValuesTwo(response) {    

                  var features = response.features;  
                  var values = features.map(function(feature) {
                    if (feature.attributes.Type == 'Visitor Center') {
                        return feature.attributes.Name;
                    } else {
                        return '';
                    }
                  });
                  return values;
                }

                function getUniqueValuesTwo(values) {
                  var uniqueValues = [];

                  values.forEach(function(item, i) {
                    if (
                      (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
                      item !== ""
                    ) {
                      uniqueValues.push(item);
                    }
                  });
                  return uniqueValues;
                }

                function addToSelectTwo(values) {
                  $('#stateFilter').empty().append('<option value="">(Select a Visitor Center)</option>');    
                  values.sort();
                  values.forEach(function(value) {
                    var option = document.createElement("option");
                    option.text = value;
                    stateFilter.add(option);
                  });
            }
            
        }
            
        function filtFunctionThree() {
                  view.when(function() {
                    return brpOverlooks.when(function() {
                      var query = brpOverlooks.createQuery();
                      return brpOverlooks.queryFeatures(query);
                    });
                  })
                  .then(getValuesThree)
                  .then(getUniqueValuesThree)
                  .then(addToSelectThree);

                function getValuesThree(response) {    

                  var features = response.features;  
                  var values = features.map(function(feature) {
                    if (feature.attributes.Type == 'Picnic Area' || feature.attributes.Type == 'Point of Interest' || feature.attributes.Type == 'Campground' || feature.attributes.Type == 'Lodging') {
                        return feature.attributes.Name;
                    } else {
                        return '';
                    }
                  });
                  return values;
                }

                function getUniqueValuesThree(values) {
                  var uniqueValues = [];

                  values.forEach(function(item, i) {
                    if (
                      (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
                      item !== ""
                    ) {
                      uniqueValues.push(item);
                    }
                  });
                  return uniqueValues;
                }

                function addToSelectThree(values) {
                  $('#stateFilter').empty().append('<option value="">(Select a Point of Interest)</option>');    
                  values.sort();
                  values.forEach(function(value) {
                    var option = document.createElement("option");
                    option.text = value;
                    stateFilter.add(option);
                  });
            } 
        }
                    
////////////End Radio Buttons///////////////////  
                    
   view.when(function() {
        return brpOverlooks.when(function() {
          var query = brpOverlooks.createQuery();
          return brpOverlooks.queryFeatures(query);
        });
      })
      .then(getValues)
      .then(getUniqueValues)
      .then(addToSelect);
          
    function getValues(response) {    
    
      var features = response.features;  
      var values = features.map(function(feature) {
        if (feature.attributes.Type == 'Overlook' || feature.attributes.Type == 'Parking Area') {
            return feature.attributes.Name;
        } else {
            return '';
        }
      });
      return values;
    }
          
    function getUniqueValues(values) {
      var uniqueValues = [];

      values.forEach(function(item, i) {
        if (
          (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
          item !== ""
        ) {
          uniqueValues.push(item);
        }
      });
      return uniqueValues;
    }

    function addToSelect(values) {
      values.sort();
      values.forEach(function(value) {
        var option = document.createElement("option");
        option.text = value;
        stateFilter.add(option);
      });
    }
                      
    //Dropdown Menu Overlook Layer//
          
    var highlightSelect;
            
        webscene.when(function () {
            
          var overlookLayer = brpOverlooks;

          view.whenLayerView(overlookLayer).then(function (layerView) {
              
            var queryOverlooks = overlookLayer.createQuery();
              
            var selectOne = document.getElementById("stateFilter");
            
            selectOne.addEventListener("change", onClick);
              
            function onClick(event) {
              queryOverlooks.where = "Name='" + event.target.value + "'";
              overlookLayer.queryFeatures(queryOverlooks).then(function (result) {
                if (highlightSelect) {
                  highlightSelect.remove();
                }
                var feature = result.features[0];
                highlightSelect = layerView.highlight(
                  feature.attributes["FID"]
                );

                view
                  .goTo(
                    {
                      target: feature.geometry,
                      tilt: 30,
                      zoom: 16
                    },
                    {
                      duration: 2000,
                      easing: "linear"
                    }
                  )
                  .then(function () {
                    view.popup.open({
                       features: [feature],
                    });
                })
              });
                      
            }
            
          });
                          
        });
        
        $('#viewDiv').on('mouseup', function(){
          highlightSelect.remove();
        });  
          
////////////Milemarker Search///////////////////
       
        webscene.when(function () {
            
          var mpLayer = milePosts;

          view.whenLayerView(mpLayer).then(function (layerView) {
              
            var queryMileposts = mpLayer.createQuery();
              
            var selectOne = document.getElementById("mpFilter");
            var selectSubmit = document.getElementById("mpFilterSubmit");
            
            selectOne.addEventListener("keyup", onClick);
            selectSubmit.addEventListener("click", onClick);
              
            function onClick(event) {
              if ((event.type === 'keyup' && event.which === 13) || event.type == 'click') {
                queryMileposts.where = "MILEPOST='" + selectOne.value + "'";
                mpLayer.queryFeatures(queryMileposts).then(function (result) {

                  var feature = result.features[0];

                  view
                    .goTo(
                      {
                        target: feature.geometry,
                        tilt: 30,
                        zoom: 16
                      },
                      {
                        duration: 2000,
                        easing: "linear"
                      }
                    )
                });
              }
            }     

          });
        });

        var max = 469;
        $('#mpFilter').keyup(function(){

            var inputValue = $(this).val();
            if(inputValue > max){
                    //alert('greater!');
                    document.getElementById("mpFilter").placeholder = "Search milposts 0 - 469";
                $(this).val('')
            }
        })

    //Legend Button//
          
        $(document).ready(function(){
          $("#infoButton").click(function(){
            $("#legendBox").fadeToggle(100);
            $(".esri-icon-documentation").toggleClass('click');
            if ($(window).width() <= 580 || $(window).height() <= 500 ) {
              $('#filterDiv').css({'display': 'none'})
              $(".toggle").removeClass('toggle-clicked');
              $("#toggle").prop('checked', true);
           }
          });
        });  

      //Toggle Button//    
      $(document).ready(function(){
        $("#toggle").click(function(){
          $("#filterDiv").fadeToggle(100);
          $(".toggle").toggleClass('toggle-clicked');
          if ($(window).width() <= 580 || $(window).height() <= 500 ) {
            $('#legendBox').css({'display': 'none'})
            $(".esri-icon-documentation").removeClass('click');
         }
        });
      });
          
          
        
    });



        
    
