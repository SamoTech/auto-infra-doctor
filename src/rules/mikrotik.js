export function runMikroTikRules(config){
  const issues = [];

  if(config.includes('chain=input') && !config.includes('action=drop')){
    issues.push({severity:'CRITICAL',message:'No drop rule in input chain',impact:'Router exposed to internet',fix:'/ip firewall filter add chain=input action=drop'});
  }

  if(config.includes('8291') || config.includes('8728')){
    issues.push({severity:'CRITICAL',message:'Management ports exposed',impact:'Remote access risk',fix:'Restrict via firewall rules'});
  }

  if(!config.includes('established,related')){
    issues.push({severity:'HIGH',message:'Missing established/related rule',impact:'Breaks normal traffic flow',fix:'/ip firewall filter add chain=input connection-state=established,related action=accept'});
  }

  if(config.includes('dst-nat') && !config.includes('forward')){
    issues.push({severity:'HIGH',message:'dst-nat without forward filtering',impact:'Uncontrolled forwarding',fix:'Add forward chain rules'});
  }

  if(config.includes('fasttrack') && !config.includes('established')){
    issues.push({severity:'HIGH',message:'FastTrack misconfiguration',impact:'Firewall bypass issues',fix:'Reorder FastTrack rule'});
  }

  return issues;
}
