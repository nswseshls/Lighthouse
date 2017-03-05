var ReturnTeamsActiveAtLHQ = function(hq,sector,cb) {

	var now = moment();
	var end = moment();
	end.subtract(1, 'y');

	UnitsToSearch = []

	if (hq.EntityTypeId != 1) {
		console.log("HQ Entity is not a unit, will resolve group")
		$.ajax({
			type: 'GET'
			, url: '/Api/v1/Entities/'+user.hq.Id+'/Children'
			, data: {LighthouseFunction: 'QuickTaskResolveChildrenOfEntity'}
			, cache: false
			, dataType: 'json'
			, complete: function(response, textStatus) {
				console.log('textStatus = "%s"', textStatus, response);
				if(textStatus == 'success')
				{
					if(response.responseJSON.length) {
						$.each(response.responseJSON, function(k,v){
							UnitsToSearch.push(v.Id);
						})
					}
					GetTeams(UnitsToSearch)
				}
			}
		})

	} else {
		UnitsToSearch.push(hq.Id)
		GetTeams(UnitsToSearch)

	}

	function GetTeams(UnitsToSearch) {



		theData = {
			'StartDate':          end.toISOString()
			, 'EndDate':            now.toISOString()
			, 'TypeIds[]':          1
			, 'IncludeDeleted':     false
			, 'StatusTypeId[]':     3
			, 'PageIndex':          1
			, 'PageSize':           1000
			, 'SortField':          'Callsign'
			, 'SortOrder':          'asc'
			,'LighthouseFunction': 'getteams' 
		}

		AssignedToId = []
		CreatedAtId = []
		$.each(UnitsToSearch, function(k,v){
			AssignedToId.push(v)
			CreatedAtId.push(v)
		})

		theData.AssignedToId = AssignedToId
		theData.CreatedAtId = CreatedAtId

		if (sector !== null)
		{
			theData.SectorIds = sector
			theData.Unsectorised = true
		}

		$.ajax({
			type: 'GET'
			, url: '/Api/v1/Teams/Search'
			, data: theData
			, cache: false
			, dataType: 'json'
			, complete: function(response, textStatus) {
				console.log('textStatus = "%s"', textStatus, response);
				if(textStatus == 'success')
				{
					cb(response)
				}

			}
		})

	}
}

module.exports = ReturnTeamsActiveAtLHQ;